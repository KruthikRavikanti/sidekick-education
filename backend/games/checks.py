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
    # `Function` is matched in its own case, so an ordinary `function (x) {}` is not mistaken for the constructor.
    # A static `import` starts a statement, so the word inside a sentence a child reads is left alone.
    ('dynamic_code', r'\beval\s*\(|(?-i:new\s+Function\b|\bFunction\s*\()|\bimport\s*\(|(?:^|[;{}\n])\s*import\s+[\w{*\'"]|\brequire\s*\('),
    ('storage', r'document\s*\.\s*cookie|localStorage|sessionStorage|indexedDB|\bcaches\b|serviceWorker'),
    # `top.` and `history.` count only as code: a name right after the dot, or a call or assignment.
    # "Stack them to the top. Then jump." is a sentence, not navigation.
    ('navigation', r'\blocation\b|window\s*\.\s*open|\.submit\s*\(|document\s*\.\s*write|\bopener\b|(^|[^.\w])top\s*\['
                   r'|(?:\bhistory|(?:^|[^.\w])top)\s*\.(?:[A-Za-z_$]|\s*[A-Za-z_$]\w*\s*[(=\[])'),
    ('outside_frame', r'\bparent\b|postMessage|window\s*\.\s*frames|__SK\b|__SK_INIT'),
    ('device', r'\bnavigator\b|getUserMedia|\bNotification\b|\bgeolocation\b|requestFullscreen|\bclipboard\b'),
    # A tag is `<name` with nothing between, then a space, `>` or `/`. `i < a` and `i<a;` are comparisons.
    ('markup', r'</?(script|iframe|object|embed|link|meta|base|form|frame|a)(?=[\s>/])|<!--|-->|\bsrcdoc\b|\bhref\b|javascript\s*:'),
    ('external_url', r'(https?:)?//[\w-]+(\.[\w-]+)+|\bdata\s*:\s*text/html'),
    ('dialog', r'\b(alert|confirm|prompt)\s*\(|\bdebugger\b'),
    ('free_text_input', r'</?(input|textarea|select)(?=[\s>/])|createElement\s*\(\s*[\'"](input|textarea|select|script|iframe|form|object|embed|link|a)[\'"]|contentEditable|contenteditable'),
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


# What each reason means, for the model that has to fix it. Reason codes alone do not say what to change.
_ADVICE = {
    'network': 'Games have no network. Remove the request.',
    'dynamic_code': 'No eval, Function constructor, import or require. Write the logic out as plain code.',
    'storage': 'Games cannot store anything. Keep state in variables, and avoid the word "caches".',
    'navigation': 'Do not use the word "location" anywhere, even in text a child reads (say "spot" or "place"), and no window.open, history or top.',
    'outside_frame': 'Do not use the word "parent" anywhere, even in text a child reads (say "grown-up" or name the animal), and no postMessage.',
    'device': 'Do not use the words "navigator", "notification", "clipboard" or "geolocation" anywhere, even in text a child reads.',
    'markup': 'No HTML tags, comments or links in the source: no <a, <script, <form, <!--, --> or href. Build things with the kit, and write an arrow as "→".',
    'external_url': 'No web addresses. Everything a game shows is drawn by the kit.',
    'dialog': 'No alert, confirm, prompt or debugger. Use sk.say to tell the child something.',
    'free_text_input': 'No text boxes or select menus. Use the kit controls: keypad, stepper, choice.',
    'runaway': 'No endless loops and no setInterval. Use sk.every for something that repeats.',
    'must_call_sidekick_game_once': 'Call Sidekick.game exactly once.',
    'code_too_large': 'The code is too long. Make it shorter.',
    'css_too_large': 'The CSS is too long. Make it shorter.',
    'control_characters': 'Remove the control characters from the source.',
    'empty_code': 'The game has no code.',
    'invalid_css': 'The CSS must be text.',
    'css_external_url': 'Game CSS may not use url() or @import.',
    'css_markup': 'Game CSS may not contain < or a backslash.',
    'css_layout_escape': 'Game CSS may not use position: fixed.',
}


def _found(pattern, text):
    """The text around the first match, so the writer can see what tripped the rule."""
    match = pattern.search(text)
    if not match:
        return ''
    start, end = max(0, match.start() - 24), min(len(text), match.end() + 24)
    return ' '.join(text[start:end].split())[:90]


def explain(code, css=''):
    """Static problems as sentences a model can act on: the rule, what to do, and the text that tripped it.

    This is for the repair prompt only. It quotes the game's own source, so it is never logged or stored.
    """
    code, css = code if isinstance(code, str) else '', css if isinstance(css, str) else ''
    patterns = dict(_COMPILED_CODE)
    css_patterns = {'css_' + reason: pattern for reason, pattern in _COMPILED_CSS}
    out = []
    for reason in static_issues(code, css):
        line = f'static_checks: {reason}. {_ADVICE.get(reason, "Remove it.")}'
        found = _found(patterns[reason], code) if reason in patterns else _found(css_patterns[reason], css) if reason in css_patterns else ''
        out.append(line + (f' Found near: {found!r}' if found else ''))
    return out
