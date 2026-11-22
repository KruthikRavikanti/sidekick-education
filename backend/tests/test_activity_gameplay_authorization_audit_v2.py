"""Authorization interruption keeps safe accounting, not an admission bypass."""
import asyncio

import pytest

from backend.accounts.security import AccountError
from backend.activity_engine_v2.composer import compose_gameplay
from backend.tests.gameplay_examples import GameplayStub
from backend.tests.program_composition_examples import context_for
from backend.tests.program_world_examples import world_program


def test_completed_design_audit_is_attached_to_the_exact_original_authorization_error():
    program=world_program('design')
    adapter=GameplayStub(program)
    original=AccountError('profile_changed','The active profile changed.',409)
    async def progress(stage):
        if stage=='evaluating_designs':raise original
    with pytest.raises(AccountError) as captured:
        asyncio.run(compose_gameplay(context_for(program),adapter=adapter,progress=progress))
    assert captured.value is original
    assert original.code=='profile_changed' and original.status==409
    assert original.call_count==1 and len(original.model_calls)==1
    assert original.model_calls[0]['task']=='design_activity_game'
    assert original.game_design is None and original.gameplay_review is None
    assert original.design_evaluations==[]
