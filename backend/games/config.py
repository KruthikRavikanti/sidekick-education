"""Settings for games. Games are how a child practices a skill, so they are on by default.

The careful settings stay careful: a person approves every game before a child sees it,
and nothing is generated in the background unless that is switched on."""
import os
from dataclasses import dataclass

PROMPT_VERSION = 'sidekick-games-v2'  # v2: the kit reference now teaches Sidekick.play patterns
MAX_REPAIRS = 2


def _flag(name, default):
    return os.getenv(name, 'true' if default else 'false').strip().casefold() in {'1', 'true', 'yes', 'on'}


@dataclass(frozen=True)
class GameSettings:
    enabled: bool
    require_approval: bool
    autogenerate: bool
    reviewers: frozenset
    model: str
    timeout: float

    @classmethod
    def from_env(cls):
        try:
            timeout = float(os.getenv('GAMES_TIMEOUT_SECONDS', '300'))
        except ValueError:
            timeout = 300.0
        return cls(
            # On unless switched off. With it off, children see no game card and cannot start a game.
            enabled=_flag('SIDEKICK_GAMES_ENABLED', True),
            # A person must approve a generated game before any child can play it.
            require_approval=_flag('SIDEKICK_GAMES_REQUIRE_APPROVAL', True),
            autogenerate=_flag('SIDEKICK_GAMES_AUTOGENERATE', False),
            reviewers=frozenset(item.strip().casefold() for item in os.getenv('SIDEKICK_GAME_REVIEWERS', '').split(',') if item.strip()),
            model=os.getenv('GAMES_MODEL', '').strip(),
            timeout=min(max(timeout, 30.0), 900.0),
        )
