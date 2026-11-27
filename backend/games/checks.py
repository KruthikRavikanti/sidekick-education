"""Static checks on model-written game source.

The locked frame (opaque origin, no network, nonce-only scripts) is the real
boundary. These checks are hygiene on top of it: they reject code that tries to
reach outside the kit, so a problem is caught before a browser ever runs it.
"""
import re

MAX_CODE_BYTES = 60_000
MAX_CSS_BYTES = 8_000

# (reason code, pattern). Reason codes are safe to log; matched text is not.
_CODE_RULES = [
    ('network', r'\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|\bimportScripts\b|RTCPeerConnection'),
    ('dynamic_code', r'\beval\s*\(|new\s+Function\b|\bFunction\s*\(|\bimport\s*\(|\bimport\s+[\w{*]|\brequire\s*\('),
    ('storage', r'document\s*\.\s*cookie|localStorage|sessionStorage|indexedDB|\bcaches\b|serviceWorker'),
    ('navigation', r'\blocation\b|window\s*\.\s*open|\bhistory\s*\.|\.submit\s*\(|document\s*\.\s*write|(^|[^.\w])top\s*\.|\bopener\b'),
    ('outside_frame', r'\bparent\b|postMessage|window\s*\.\s*frames|__SK\b|__SK_INIT'),
    ('device', r'\bnavigator\b|getUserMedia|\bNotification\b|\bgeolocation\b|requestFullscreen|\bclipboard\b'),
    ('markup', r'<\s*/?\s*(script|iframe|object|embed|link|meta|base|form|frame|a)\b|<!--|-->|\bsrcdoc\b|\bhref\b|javascript\s*:'),
    ('external_url', r'(https?:)?//[\w-]+(\.[\w-]+)+|\bdata\s*:\s*text/html'),
    ('dialog', r'\b(alert|confirm|prompt)\s*\(|\bdebugger\b'),
    ('free_text_input', r'<\s*(input|textarea|select)\b|createElement\s*\(\s*[\'"](input|textarea|select|script|iframe|form|object|embed|link|a)[\'"]|contentEditable|contenteditable'),
    ('runaway', r'while\s*\(\s*(true|1)\s*\)|for\s*\(\s*;\s*;\s*\)|\bsetInterval\s*\('),
]
_CSS_RULES = [
    ('external_url', r'url\s*\(|@import|expression\s*\(|(https?:)?//[\w-]+(\.[\w-]+)+'),
    ('markup', r'<|>\s*/?\s*style|\\'),
    ('layout_escape', r'position\s*:\s*fixed'),
]
_COMPILED_CODE = [(code, re.compile(pattern, re.I)) for code, pattern in _CODE_RULES]
_COMPILED_CSS = [(code, re.compile(pattern, re.I)) for code, pattern in _CSS_RULES]


def static_issues(code, css=''):
    """Return a sorted list of reason codes. Empty means the source may be run in the frame."""
    issues = set()
    if not isinstance(code, str) or not code.strip():
        return ['empty_code']
    if not isinstance(css, str):
        return ['invalid_css']
    if len(code.encode('utf-8')) > MAX_CODE_BYTES:
        issues.add('code_too_large')
    if len(css.encode('utf-8')) > MAX_CSS_BYTES:
        issues.add('css_too_large')
    if len(re.findall(r'Sidekick\s*\.\s*game\s*\(', code)) != 1:
        issues.add('must_call_sidekick_game_once')
    if any(ord(ch) < 9 or 13 < ord(ch) < 32 for ch in code + css):
        issues.add('control_characters')
    for reason, pattern in _COMPILED_CODE:
        if pattern.search(code):
            issues.add(reason)
    for reason, pattern in _COMPILED_CSS:
        if pattern.search(css):
            issues.add('css_' + reason)
    return sorted(issues)
