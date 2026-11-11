"""Typed sample data boundary. Replace with real learning records later.

Every data-access function accepts account and child identifiers and verifies ownership.
These samples are deliberately independent of worksheet extraction results.
"""
from .models import Analytics, ConversationSummary, ConversationView, DashboardView, Message, Skill
from .security import AccountError, SessionRecord, kid_view

# Grade-appropriate Common Core skill references, including unassessed examples.
SKILLS = {
    'K': [('math','Counting objects','K.CC.B.4'),('math','Comparing numbers','K.CC.C.6'),('ela','Story details','RL.K.1'),('ela','Letter sounds','RF.K.3')],
    '1': [('math','Addition within 20','1.OA.C.6'),('math','Place value','1.NBT.B.2'),('ela','Story details','RL.1.1'),('ela','Long and short vowels','RF.1.3.c')],
    '2': [('math','Addition and subtraction','2.NBT.B.5'),('math','Equal groups','2.OA.C.4'),('ela','Story understanding','RL.2.1'),('ela','Main topic','RI.2.2')],
    '3': [('math','Multiplication facts','3.OA.C.7'),('math','Understanding fractions','3.NF.A.1'),('ela','Main idea and details','RI.3.2'),('ela','Character traits','RL.3.3')],
    '4': [('math','Equivalent fractions','4.NF.A.1'),('math','Multi-digit multiplication','4.NBT.B.5'),('ela','Drawing inferences','RL.4.1'),('ela','Main idea and evidence','RI.4.2')],
    '5': [('math','Adding fractions','5.NF.A.1'),('math','Decimal operations','5.NBT.B.7'),('ela','Text evidence','RL.5.1'),('ela','Comparing themes','RL.5.2')],
}


def assert_parent_snapshot(security, connection, account_id: str, expected_session: SessionRecord | None):
    if expected_session is not None:
        security.assert_active(connection, expected_session, 'parent')
        if expected_session.account_id != account_id:
            raise AccountError('parent_required', 'Enter your parent PIN to continue.', 403)


def get_dashboard(security, account_id: str, child_id: str, expected_session: SessionRecord | None = None) -> DashboardView:
    with security.db.transaction() as connection:
        assert_parent_snapshot(security, connection, account_id, expected_session)
        profile = kid_view(security.owned_kid(connection, account_id, child_id))
    statuses = ['gap', 'practicing', 'mastered', 'unassessed']
    skills = [Skill(id=f'skill-{index}', subject=subject, name=name, commonCoreCode=code, status=statuses[index]) for index,(subject,name,code) in enumerate(SKILLS[profile.grade])]
    started = security.clock.now() - 86400
    conversations = [ConversationSummary(id=f'{child_id}-sample-1',title='Making sense of homework',startedAt=started,preview='A sample conversation about showing each step.')]
    result = DashboardView(profile=profile, skills=skills, analytics=Analytics(sessionsThisWeek=3,timeSpentMinutes=28,problemsAttempted=12,problemsCorrect=8),conversations=conversations)
    with security.db.transaction() as connection:
        assert_parent_snapshot(security, connection, account_id, expected_session)
    return result


def get_conversation(security, account_id: str, child_id: str, conversation_id: str, expected_session: SessionRecord | None = None) -> ConversationView:
    dashboard = get_dashboard(security, account_id, child_id, expected_session)
    if conversation_id != f'{child_id}-sample-1':
        raise AccountError('not_found','That conversation was not found.',404)
    started = dashboard.conversations[0].startedAt
    result = ConversationView(id=conversation_id,title='Making sense of homework',startedAt=started,messages=[
        Message(role='student',text='I’m not sure where to start with this problem.',timestamp=started),
        Message(role='sidekick',text='Let’s look at what the question asks and take one step at a time.',timestamp=started+12),
        Message(role='student',text='I can show the first step in my work.',timestamp=started+30),
    ])
    with security.db.transaction() as connection:
        assert_parent_snapshot(security, connection, account_id, expected_session)
    return result
