"""Inspect the committed catalog plan and evidence of actual activity execution.

Mechanic suitability, generated/validated content, and played/scored outcomes are
different facts. Assigning a family never creates either of the latter facts.
No private family database or uploaded work is read by the default report.
"""
import hashlib
import json
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MAP_PATH = ROOT / 'data/activities/catalog_coverage.json'
CATALOG_PATH = ROOT / 'data/sidekick_skill_map_v2.json'
EVIDENCE_PATHS = (ROOT / 'data/activities/catalog_verification.json', ROOT / 'data/activities/catalog_live_verification.json',
                  ROOT / 'data/activities/composition_live_verification.json')
GRADE_NAMES = ('K', '1', '2', '3', '4', '5')
COMPONENTS = frozenset({'quantity_lab', 'math_workspace', 'sort_connect', 'text_editor', 'oral_studio', 'drawing_studio',
    'bundle_builder', 'tile_order', 'evidence_board', 'fraction_split_compare', 'fraction_builder', 'number_line', 'word_tiles', 'word_choice'})
MEANINGFUL_COMPONENTS = COMPONENTS - {'word_choice'}
ENTRY_FIELDS = {'subskillId', 'subject', 'grade', 'domain', 'family', 'demonstration', 'actionEvidence',
                'primaryMechanic', 'mechanics', 'modes', 'assessment', 'parentParticipation', 'constraints', 'requirements'}
CONSTRAINT_FIELDS = {'requiredResponse', 'requiredVisual', 'workspaceModes', 'minWrittenWords', 'requiredGuidedMechanics'}


def file_sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def validate_document(document):
    """Fail closed on catalog drift or incomplete/mismatched per-ID assignments."""
    if document.get('schemaVersion') != '1.0' or document.get('catalogSha256') != file_sha(CATALOG_PATH):
        raise ValueError('Activity coverage map requires review for this catalog version')
    catalog = {row['subskill_id']: row for row in json.loads(CATALOG_PATH.read_text()) if row['grade'] in GRADE_NAMES}
    entries = document.get('subskills')
    if not isinstance(entries, list) or len(entries) != len(catalog):
        raise ValueError('Activity coverage must record every K–5 catalog subskill exactly once')
    indexed = {}
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != ENTRY_FIELDS:
            raise ValueError('Invalid catalog coverage record')
        sid = entry['subskillId']
        if sid not in catalog or sid in indexed:
            raise ValueError('Unknown or duplicated catalog coverage subskill')
        target = catalog[sid]
        if (entry['demonstration'] != target['subskill']
                or entry['subject'] != ('math' if target['subject'] == 'Math' else 'ela')
                or type(entry['grade']) is not int or entry['grade'] != (0 if target['grade'] == 'K' else int(target['grade']))
                or entry['domain'] != (target['domain'] or 'Georgia Supplement')):
            raise ValueError('Coverage demonstration and catalog target disagree')
        if entry['family'] not in document['families'] or entry['assessment'] not in {'automatic', 'parent_review'}:
            raise ValueError('Unknown skill family or assessment method')
        mechanics = entry['mechanics']
        if (not isinstance(mechanics, list) or not mechanics or len(set(mechanics)) != len(mechanics)
                or not set(mechanics) <= COMPONENTS or entry['primaryMechanic'] not in mechanics):
            raise ValueError('Coverage requires implemented reusable mechanics')
        constraints = entry['constraints']
        if not isinstance(constraints, dict) or set(constraints) != CONSTRAINT_FIELDS:
            raise ValueError('Invalid activity coverage constraints')
        if constraints['requiredResponse'] not in {None, 'oral', 'drawing', 'writing'}:
            raise ValueError('Unsupported required response mode')
        if constraints['requiredResponse'] in {'oral', 'drawing'} and entry['assessment'] != 'parent_review':
            raise ValueError('Oral/drawn evidence requires explicit parent review')
        required = constraints['requiredGuidedMechanics']
        if not required or not set(required) <= set(mechanics) or not set(required) & MEANINGFUL_COMPONENTS:
            raise ValueError('Coverage cannot substitute decorative question choices for target actions')
        if (type(entry['parentParticipation']) is not bool or type(constraints['minWrittenWords']) is not int
                or not 0 <= constraints['minWrittenWords'] <= 1000):
            raise ValueError('Invalid parent participation or writing bounds')
        indexed[sid] = entry
    if set(indexed) != set(catalog):
        raise ValueError('Activity coverage contains uncovered K–5 catalog IDs')
    return indexed


@lru_cache(maxsize=1)
def catalog_map():
    return validate_document(json.loads(MAP_PATH.read_text()))


def for_subskill(target):
    sid = target if isinstance(target, str) else target.get('subskill_id', target.get('subskillId', ''))
    return catalog_map().get(sid)


def available_components():
    """A map entry only counts as suitable when backend AND React know the control."""
    import re
    from .models import ActivitySpec
    schema = ActivitySpec.model_json_schema()
    server = {definition.get('properties', {}).get('component', {}).get('const') for definition in schema.get('$defs', {}).values()}
    client = set(re.findall(r'component:\s*"([a-z_]+)"', (ROOT / 'lib/activity-types.ts').read_text()))
    rendered = set()
    for path in (ROOT / 'components').glob('activity*.tsx'):
        rendered.update(re.findall(r'case\s+"([a-z_]+)"\s*:', path.read_text()))
    return COMPONENTS & server & client & rendered


def implementation_features():
    """Inspect shared material/mode support as well as component names."""
    import re
    from .models import ActivitySpec
    definitions = ActivitySpec.model_json_schema().get('$defs', {})
    types = (ROOT / 'lib/activity-types.ts').read_text()
    mode_match = re.search(r'component:\s*"math_workspace";[\s\S]*?mode:\s*([^;]+);', types)
    visual_match = re.search(r'export interface ActivityVisual\s*\{\s*kind:\s*([^;]+);', types)
    client_modes = set(re.findall(r'"([a-z_]+)"', mode_match.group(1))) if mode_match else set()
    client_visuals = set(re.findall(r'"([a-z_]+)"', visual_match.group(1))) if visual_match else set()
    server_modes = set(definitions.get('MathWorkspaceParams', {}).get('properties', {}).get('mode', {}).get('enum', []))
    server_visuals = set(definitions.get('FamilyVisual', {}).get('properties', {}).get('kind', {}).get('enum', []))
    return dict(workspaceModes=server_modes & client_modes, visualKinds=server_visuals & client_visuals,
                coinAssets=all((ROOT / f'public/activities/coins/{coin}.jpg').is_file() for coin in ['penny', 'nickel', 'dime', 'quarter']))


def evidence_records(paths=EVIDENCE_PATHS):
    """Only explicit current-map execution proof can advance coverage stages."""
    indexed = defaultdict(list)
    rejected = []
    expected_hash = file_sha(MAP_PATH)
    from .models import COMPONENT_VERSION, PROMPT_VERSION
    for path in map(Path, paths):
        if not path.is_file():
            continue
        try:
            report = json.loads(path.read_text())
        except (OSError, ValueError):
            rejected.append(dict(source=str(path.relative_to(ROOT)) if path.is_relative_to(ROOT) else path.name, reason='invalid_report'))
            continue
        source = str(path.relative_to(ROOT)) if path.is_relative_to(ROOT) else path.name
        if report.get('coverageMapSha256') != expected_hash:
            rejected.append(dict(source=source, reason='different_or_unrecorded_coverage_version'))
            continue
        for case in report.get('cases', []):
            sid = case.get('subskillId')
            if sid not in catalog_map():
                continue
            spec_hash = case.get('specSha256', '')
            if (not isinstance(spec_hash, str) or len(spec_hash) != 64
                    or any(character not in '0123456789abcdef' for character in spec_hash)
                    or case.get('providerMode') not in {'fixture', 'live'}):
                continue
            if case.get('assessment') not in {'automatic', 'parent_review'}:
                continue
            mapped_manual = catalog_map()[sid]['assessment'] == 'parent_review'
            if mapped_manual and case['assessment'] != 'parent_review':
                continue
            generated = case.get('generatedValidated') is True
            outcome = case.get('outcome')
            manual = mapped_manual or case['assessment'] == 'parent_review'
            scored = (generated and case.get('playedScored') is True
                      and outcome in {'correct', 'incorrect'}
                      and (not manual or case.get('parentReviewed') is True))
            current_composition = (case['providerMode'] == 'live' and report.get('componentVersion') == COMPONENT_VERSION
                and report.get('promptVersion') == PROMPT_VERSION and report.get('emptyLibraryAtStart') is True
                and case.get('liveUpload') is True and case.get('noFinishedActivityReuse') is True)
            indexed[sid].append(dict(source=source, generatedValidated=generated, playedScored=scored,
                providerMode=case['providerMode'], specSha256=spec_hash, outcome=outcome,
                parentReviewed=case.get('parentReviewed') is True, currentComposition=current_composition))
    return indexed, rejected


def build_report(evidence_paths=EVIDENCE_PATHS):
    mapping = catalog_map()
    implemented = available_components()
    features = implementation_features()
    evidence, rejected = evidence_records(evidence_paths)
    entries, groups = [], defaultdict(list)
    for sid, entry in mapping.items():
        mechanics = set(entry['mechanics'])
        required = entry['constraints']['requiredResponse']
        response_component = {'oral': 'oral_studio', 'drawing': 'drawing_studio', 'writing': 'text_editor'}.get(required)
        suitable = bool(set(entry['constraints']['requiredGuidedMechanics']) & implemented)
        missing_requirements = []
        if response_component and response_component not in implemented:
            suitable = False
        modes = set(entry['constraints']['workspaceModes'])
        if modes and not modes & features['workspaceModes']:
            suitable = False
            missing_requirements.append('workspace_mode:' + '|'.join(sorted(modes)))
        visual = entry['constraints']['requiredVisual']
        if visual == 'geometry':
            has_visual = bool({'shape', 'grid'} & features['workspaceModes']) or 'diagram' in features['visualKinds']
        elif visual == 'chart' and required not in {'oral', 'drawing', 'writing'}:
            has_visual = 'chart' in features['workspaceModes'] or 'chart' in features['visualKinds']
        else:
            has_visual = visual is None or visual in features['visualKinds']
        if not has_visual:
            suitable = False
            missing_requirements.append('visual:' + str(visual))
        if visual == 'coins' and not features['coinAssets']:
            suitable = False
            missing_requirements.append('coin_image_assets')
        stages = dict(mechanicSuitable=suitable,
            generatedValidated=any(case['generatedValidated'] for case in evidence[sid]),
            playedScored=any(case['playedScored'] for case in evidence[sid]),
            liveComposedGenerated=any(case['currentComposition'] and case['generatedValidated'] for case in evidence[sid]),
            liveComposedPlayed=any(case['currentComposition'] and case['playedScored'] for case in evidence[sid]))
        item = dict(subskillId=sid, grade=entry['grade'], subject=entry['subject'], domain=entry['domain'],
                    family=entry['family'], assessment=entry['assessment'], parentParticipation=entry['parentParticipation'],
                    **stages, missingMechanics=sorted(mechanics - implemented) if not suitable else [],
                    missingImplementationRequirements=missing_requirements, evidence=evidence[sid])
        entries.append(item)
        groups[(entry['subject'], entry['grade'], entry['domain'])].append(item)
    def counts(items):
        return dict(total=len(items), mechanicSuitable=sum(item['mechanicSuitable'] for item in items),
            liveComposedGenerated=sum(item['liveComposedGenerated'] for item in items),
            liveComposedPlayed=sum(item['liveComposedPlayed'] for item in items),
            unverifiedLiveComposition=[item['subskillId'] for item in items if not item['liveComposedPlayed']],
            generatedValidated=sum(item['generatedValidated'] for item in items), playedScored=sum(item['playedScored'] for item in items),
            fixtureGeneratedValidated=sum(any(case['providerMode'] == 'fixture' and case['generatedValidated'] for case in item['evidence']) for item in items),
            liveGeneratedValidated=sum(any(case['providerMode'] == 'live' and case['generatedValidated'] for case in item['evidence']) for item in items),
            fixturePlayedScored=sum(any(case['providerMode'] == 'fixture' and case['playedScored'] for case in item['evidence']) for item in items),
            livePlayedScored=sum(any(case['providerMode'] == 'live' and case['playedScored'] for case in item['evidence']) for item in items),
            uncovered=[item['subskillId'] for item in items if not item['mechanicSuitable']])
    return dict(schemaVersion='1.0', catalogSha256=file_sha(CATALOG_PATH), coverageMapSha256=file_sha(MAP_PATH),
        definitions=dict(mechanicSuitable='A mapped meaningful control and required response mode exist in both backend and React; semantic/material requirements still gate every generated activity.',
            liveComposedGenerated='An actual-provider composition from an initially empty library passed the CURRENT component/prompt versions through a real upload, without reusing a finished activity.',
            liveComposedPlayed='That current live composition completed the independent challenge and reached protected parent history with an automatic or explicit parent outcome.',
            generatedValidated='A current-map evidence record identifies an actual generated definition that passed activity validation and independent review.',
            playedScored='A current-map generated activity was actually completed and scored, including explicit parent review when required. Pending review is not scored.'),
        totals=counts(entries), assessmentTotals=dict(Counter(item['assessment'] for item in entries)),
        parentAssistedCount=sum(item['parentParticipation'] for item in entries),
        implementedMechanics=sorted(implemented),
        implementedWorkspaceModes=sorted(features['workspaceModes']), sharedVisualKinds=sorted(features['visualKinds']),
        byGradeDomain=[dict(subject=subject, grade=grade, domain=domain, **counts(items))
                       for (subject, grade, domain), items in sorted(groups.items())],
        rejectedEvidenceReports=rejected, subskills=entries)


def markdown_report(report):
    totals = report['totals']
    lines = ['# Sidekick K–5 activity coverage', '',
        f"Current live composer: **{totals['liveComposedGenerated']}** skills generated and validated; "
        f"**{totals['liveComposedPlayed']}** played and scored through real uploads with an initially empty library.", '',
        f"**{len(totals['unverifiedLiveComposition'])} of {totals['total']} skills remain unverified through the current live flow.** "
        'A mapped control is a coverage plan, not a successful lesson.', '',
        f"Mapped mechanic paths: **{totals['mechanicSuitable']}**. Historical/current evidence combined: "
        f"**{totals['generatedValidated']}** generated/validated and **{totals['playedScored']}** played/scored.", '',
        f"Controlled model-boundary fixtures: **{totals['fixtureGeneratedValidated']}** generated/validated, "
        f"**{totals['fixturePlayedScored']}** played/scored. Actual configured provider: "
        f"**{totals['liveGeneratedValidated']}** generated/validated, **{totals['livePlayedScored']}** played/scored. "
        'A skill may appear in both groups; fixture output is not evidence of actual model generation quality.', '',
        'These are separate stages. A catalog assignment is not evidence that an activity was generated or played. '
        'Parent-reviewed artifacts remain pending until a parent records an outcome. '
        'Full pedagogical effectiveness and repeated real-world performance are not established by a playable path.', '',
        '| Subject | Grade | Domain | Catalog | Mapped path | Current live generated | Current live played + scored |',
        '| --- | --- | --- | ---: | ---: | ---: | ---: |']
    for row in report['byGradeDomain']:
        grade = 'K' if row['grade'] == 0 else row['grade']
        lines.append(f"| {row['subject']} | {grade} | {row['domain']} | {row['total']} | {row['mechanicSuitable']} | {row['liveComposedGenerated']} | {row['liveComposedPlayed']} |")
    lines += ['', '## Uncovered subskills', '']
    uncovered = [row for row in report['subskills'] if not row['mechanicSuitable']]
    if not uncovered:
        lines.append('None at the mapped mechanic/response stage. Generation and execution remain separately measured above.')
    else:
        lines += [f"- `{row['subskillId']}` — {row['subject']}, grade {'K' if row['grade'] == 0 else row['grade']}, {row['domain']}; missing: {', '.join([*row['missingMechanics'], *row['missingImplementationRequirements']])}." for row in uncovered]
    lines += ['', '## Assessment and participation', '',
        f"Automatic assessment paths: **{report['assessmentTotals'].get('automatic', 0)}**. "
        f"Parent-review paths: **{report['assessmentTotals'].get('parent_review', 0)}**. "
        f"Paths also requiring witnessed participation/performance: **{report['parentAssistedCount']}**.", '',
        'The per-ID map records the exact catalog demonstration, compatible controls, required response and visual material, '
        'family action evidence, and any parent-observed requirements. No text-only stand-in counts as recorded oral reading, '
        'handwriting, a visible diagram, or collaboration.', '',
        'Evidence sources are recorded per subskill in `coverage_report.json`; reports from another map revision are explicitly excluded.', '']
    return '\n'.join(lines)
