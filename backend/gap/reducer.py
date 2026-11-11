"""Pure homework observations. Quizzes and practice never drive current states."""
from copy import deepcopy

from .config import CONFIG, LearningConfig


def initial_state():
    return dict(status='unassessed', last_event_seq=0, observations={}, correct_count=0,
                incorrect_count=0)


def reduce_state(current, events, completed_assignments=None,
                 config: LearningConfig = CONFIG, now: float = 0):
    """Accumulate distinct eligible homework observations without scheduling work.

    A correct observation supports on_track. Repeated distinct incorrect homework
    observations suggest needs_support; this is not a diagnostic confirmation or
    a mastery judgment. Historical check/practice/recheck events are ignored.
    The application supplies the full retained homework history when recomputing.
    """
    state = initial_state() | deepcopy(current or {})
    observations = dict(state.get('observations') or {})
    for event in sorted(events, key=lambda value: value['seq']):
        if event['seq'] <= state['last_event_seq']:
            continue
        state['last_event_seq'] = event['seq']
        if event.get('source') != 'homework' or not event.get('eligible'):
            continue
        if event.get('correctness') not in ('correct', 'incorrect'):
            continue
        identity = event.get('fingerprint') or event.get('source_ref')
        if identity:
            observations.setdefault(identity, event['correctness'])
    state['observations'] = observations
    state['correct_count'] = list(observations.values()).count('correct')
    state['incorrect_count'] = list(observations.values()).count('incorrect')
    state['status'] = ('needs_support' if state['incorrect_count'] >= config.homework_errors_for_support
                       else 'on_track' if state['correct_count'] else 'unassessed')
    return state, []
