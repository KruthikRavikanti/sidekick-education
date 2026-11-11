"""Pure, replay-safe learning transitions. No database, network, or wall clock."""
from copy import deepcopy
from .config import CONFIG, LearningConfig


def initial_state():
    return dict(status='unassessed', episode=1, last_event_seq=0,
                incorrect_problem_ids=[], streak=0, streak_dates=[],
                next_recheck_date=None, processed_assignments=[], last_check_outcome=None)


def reduce_state(current, events, completed_assignments, config: LearningConfig = CONFIG, now: float = 0):
    """Return (state, explicit actions) using supplied, ordered facts only.

    Each event has seq/source/correctness/eligible and a server timestamp. Practice
    eligibility additionally requires independent, fresh, first_graded, no hint or
    reveal. Reading aloud deliberately does not disqualify an answer. Assignment
    results contain one final eligible grade per slot; partial results stay pending.
    """
    state = initial_state() | deepcopy(current or {})
    actions = []
    # Assignment completion follows the final event for that assignment. Replaying
    # a check and later practice in one batch must produce the incremental result.
    maximum = max((event['seq'] for event in events), default=state['last_event_seq'])
    timeline = [(event['seq'], 0, 'event', event) for event in events]
    timeline += [(assignment.get('completion_seq') or maximum + 1, 1, 'assignment', assignment) for assignment in completed_assignments]
    for _, _, kind, event in sorted(timeline, key=lambda value: (value[0], value[1])):
        if kind == 'assignment':
            _apply_completed(state, actions, event, config, now)
            continue
        if event['seq'] <= state['last_event_seq']:
            continue
        state['last_event_seq'] = event['seq']
        if not event.get('eligible') or event.get('correctness') not in ('correct', 'incorrect'):
            continue
        source, correct = event['source'], event['correctness'] == 'correct'
        if source == 'homework':
            if correct and state['status'] == 'unassessed':
                state['status'] = 'on_track'
            if not correct and state['status'] in ('unassessed', 'on_track', 'mastered'):
                identity = event.get('fingerprint') or event.get('source_ref')
                if identity and identity not in state['incorrect_problem_ids']:
                    state['incorrect_problem_ids'].append(identity)
                if len(state['incorrect_problem_ids']) >= config.homework_errors_for_check:
                    state['status'] = 'checking'
                    actions.append({'type': 'create_assignment', 'purpose': 'check', 'count': config.check_items})
        elif source == 'practice' and state['status'] in ('gap', 'practicing'):
            independent = event.get('independent', True) and event.get('first_graded', True) and event.get('fresh', True)
            independent = independent and not event.get('hint_used') and not event.get('answer_revealed')
            if not independent:
                continue
            state['status'] = 'practicing'
            if not correct:
                state['streak'], state['streak_dates'] = 0, []
            else:
                state['streak'] += 1
                date = config.date(event.get('created_at', now))
                if date not in state['streak_dates']:
                    state['streak_dates'].append(date)
                if state['streak'] >= config.mastery_streak and len(state['streak_dates']) >= config.mastery_dates:
                    state['status'] = 'mastered'
                    state['next_recheck_date'] = config.recheck_date(event.get('created_at', now))
                    actions.append({'type': 'mastered'})
    return state, actions


def _apply_completed(state, actions, assignment, config, now):
    identity = assignment['id']
    if identity in state['processed_assignments']:
        return
    purpose, grades = assignment['purpose'], assignment.get('grades', [])
    expected = config.check_items if purpose == 'check' else config.recheck_items if purpose == 'recheck' else assignment.get('count', len(grades))
    if len(grades) != expected or any(grade not in ('correct', 'incorrect') for grade in grades):
        return
    state['processed_assignments'].append(identity)
    if purpose == 'check':
        failed = grades.count('incorrect') >= config.check_fail_misses
        state['status'] = 'gap' if failed else 'on_track'
        state['last_check_outcome'] = 'gap' if failed else 'passed'
        state['episode'] += 1
        state['incorrect_problem_ids'] = []
        state['streak'], state['streak_dates'] = 0, []
        state['next_recheck_date'] = None
        actions.append({'type': 'check_failed' if failed else 'check_passed', 'assignment_id': identity})
    elif purpose == 'recheck':
        if all(grade == 'correct' for grade in grades):
            state['status'] = 'mastered'
            state['next_recheck_date'] = config.recheck_date(assignment.get('completed_at', now))
        else:
            state['status'] = 'practicing'
            state['streak'], state['streak_dates'] = 0, []
            state['next_recheck_date'] = None
            actions.append({'type': 'resume_practice'})
