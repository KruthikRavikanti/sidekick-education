"""One versioned source of learning thresholds and calendar behavior."""
import json
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo


@dataclass(frozen=True)
class LearningConfig:
    timezone: str = 'America/New_York'
    homework_errors_for_check: int = 2
    check_items: int = 5
    check_fail_misses: int = 2
    mastery_streak: int = 3
    mastery_dates: int = 2
    recheck_days: int = 21
    recheck_items: int = 2
    mapping_confidence: float = .6
    max_chain_depth: int = 8
    session_min_items: int = 5
    session_max_items: int = 8
    practice_round_items: int = 5
    generation_retries: int = 2
    generation_concurrency: int = 2

    def date(self, timestamp: float) -> str:
        return datetime.fromtimestamp(timestamp, ZoneInfo(self.timezone)).date().isoformat()

    def recheck_date(self, timestamp: float) -> str:
        return (datetime.fromtimestamp(timestamp, ZoneInfo(self.timezone)).date() + timedelta(days=self.recheck_days)).isoformat()


CONFIG = LearningConfig(**json.loads(Path(__file__).with_name('config.json').read_text()))
