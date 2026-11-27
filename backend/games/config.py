"""Settings for games. Games are how a child practices a skill, so they are on by default.

The careful settings stay careful: a person approves every game before a child sees it,
and nothing is generated in the background unless that is switched on."""
import os
from dataclasses import dataclass

PROMPT_VERSION = 'sidekick-games-v3'  # v3: the reviewer stops defects only and leaves notes for the person who reviews
MAX_REPAIRS = 3    # rewrites after the static checks or the robot found a problem
MAX_REWRITES = 2   # rewrites after the model reviewer found a defect


def _flag(name, default):
    return os.getenv(name, 'true' if default else 'false').strip().casefold() in {'1', 'true', 'yes', 'on'}


@dataclass(frozen=True)
class GameSettings:
    enabled: bool
    require_approval: bool
    autogenerate: bool
    premade: bool
    new_every_upload: bool
    playground: bool
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
            # The games that ship with the app. Off means they are ignored everywhere, as if never loaded,
            # so every game a child gets was written by the model. They stay stored, so on brings them straight back.
            premade=_flag('SIDEKICK_GAMES_PREMADE', True),
            # For testing the writer: every upload gets its own newly written game, even when a game for its skill
            # already exists. It only means something while AUTOGENERATE is on and a model is configured.
            new_every_upload=_flag('SIDEKICK_GAMES_NEW_EVERY_UPLOAD', False),
            # Temporary: shows reviewers a page for trying any stored game. It adds no access of its own.
            playground=_flag('SIDEKICK_GAMES_PLAYGROUND', False),
            reviewers=frozenset(item.strip().casefold() for item in os.getenv('SIDEKICK_GAME_REVIEWERS', '').split(',') if item.strip()),
            model=os.getenv('GAMES_MODEL', '').strip(),
            timeout=min(max(timeout, 30.0), 900.0),
        )
