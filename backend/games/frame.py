"""Builds the one self-contained HTML document a generated game runs in.

The document carries the kit, the fonts and the game inline, so it never needs the
network. It is served with a Content-Security-Policy that includes `sandbox`, which
gives it an opaque origin: no cookies, no storage, no access to the Sidekick app.
"""
import base64
import json
import re
import secrets
from functools import lru_cache
from pathlib import Path

KIT_VERSION = 'kit-1'
ROOT = Path(__file__).resolve().parents[2]
KIT_DIR = Path(__file__).resolve().parent / 'kit'

_FETCH_POLICY = (
    "default-src 'none'; script-src 'nonce-{nonce}'; style-src 'unsafe-inline'; img-src data: blob:; "
    "font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; child-src 'none'; "
    "worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
)


def _data_uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')


@lru_cache(maxsize=4)
def kit_assets(version=KIT_VERSION):
    if version != KIT_VERSION:
        raise ValueError('Unknown kit version')
    css = (KIT_DIR / 'kit.css').read_text(encoding='utf-8')
    css = css.replace('__SK_FONT_FREDOKA__', _data_uri(ROOT / 'public/fonts/fredoka-latin.woff2', 'font/woff2'))
    css = css.replace('__SK_FONT_NUNITO__', _data_uri(ROOT / 'public/fonts/nunito-latin.woff2', 'font/woff2'))
    css = css.replace('__SK_MASCOT__', _data_uri(ROOT / 'public/sidekick-mascot.svg', 'image/svg+xml'))
    return css, (KIT_DIR / 'kit.js').read_text(encoding='utf-8')


def content_security_policy(nonce, *, header=True):
    policy = _FETCH_POLICY.format(nonce=nonce)
    # `sandbox` and `frame-ancestors` only work as a response header, not in <meta>.
    return policy + "; sandbox allow-scripts; frame-ancestors 'self'" if header else policy


def frame_headers(nonce):
    return {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': content_security_policy(nonce),
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), clipboard-read=(), clipboard-write=()',
        'Cache-Control': 'no-store',
    }


def _inline_script(source):
    """Keep a script from ending its own tag or opening an HTML comment, whatever the checks let through."""
    return re.sub(r'</(script)', r'<\\/\1', source, flags=re.I).replace('<!--', '<\\!--')


def build_document(code, css='', *, seed=None, title='Sidekick game', kit_version=KIT_VERSION, nonce=None, token=None):
    """Return (html, nonce). `code` and `css` must already have passed checks.static_issues."""
    kit_css, kit_js = kit_assets(kit_version)
    nonce = nonce or secrets.token_urlsafe(18)
    token = token or secrets.token_urlsafe(24)
    if not all(ch.isalnum() or ch in '-_' for ch in token):
        raise ValueError('Invalid message token')
    kit_js = kit_js.replace('__SK_MESSAGE_TOKEN__', token)
    if '<' in (css or ''):
        # Markup has no place in a stylesheet, and '</style>' would let it out of its tag.
        raise ValueError('Invalid game stylesheet')
    init = json.dumps({'seed': int(seed) if seed is not None else None, 'kit': kit_version})
    safe_title = ''.join(ch for ch in str(title) if ch.isalnum() or ch in ' -:,!?\'')[:80]
    html = (
        '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<meta http-equiv="Content-Security-Policy" content="{content_security_policy(nonce, header=False)}">'
        f'<title>{safe_title}</title>\n<style>{kit_css}</style>\n<style>{css or ""}</style></head>\n'
        '<body><div id="sk-root"></div>\n'
        f'<script nonce="{nonce}">window.__SK_INIT={init};</script>\n'
        f'<script nonce="{nonce}">{_inline_script(kit_js)}</script>\n'
        f'<script nonce="{nonce}">\n{_inline_script(code)}\n</script>\n</body></html>\n'
    )
    return html, nonce
