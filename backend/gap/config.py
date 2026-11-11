"""One versioned source for homework observations and mapping confidence."""
import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


@dataclass(frozen=True)
class LearningConfig:
    timezone: str = 'America/New_York'
    homework_errors_for_support: int = 2
    mapping_confidence: float = .6

    def date(self, timestamp: float) -> str:
        return datetime.fromtimestamp(timestamp, ZoneInfo(self.timezone)).date().isoformat()


CONFIG = LearningConfig(**json.loads(Path(__file__).with_name('config.json').read_text()))
