"""Explicit local/HTTPS configuration for account security."""
import os
from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass(frozen=True)
class Settings:
    database_url: str = "sqlite:///backend/data/sidekick.db"
    app_env: str = "production"
    password_policy: str = "strict"
    cookie_secure: bool = True
    trusted_origins: tuple[str, ...] = ("https://localhost",)
    session_seconds: int = 30 * 24 * 60 * 60
    parent_idle_seconds: int = 30 * 60
    pin_lock_seconds: int = 5 * 60

    def __post_init__(self):
        if self.password_policy not in {"dev", "strict"}:
            raise ValueError("PASSWORD_POLICY must be dev or strict")
        if self.password_policy == "dev" and self.app_env not in {"development", "test"}:
            raise ValueError("Development passwords require APP_ENV=development or test")
        if not self.cookie_secure and self.app_env not in {"development", "test"}:
            raise ValueError("Insecure cookies are only allowed in development/test")
        for origin in self.trusted_origins:
            parsed = urlparse(origin)
            if not parsed.hostname or parsed.path or parsed.query or parsed.fragment or parsed.username:
                raise ValueError("TRUSTED_ORIGINS must contain exact origins without paths")
            if parsed.scheme not in {"http", "https"} or (self.app_env not in {"development", "test"} and parsed.scheme != "https"):
                raise ValueError("Production trusted origins must use HTTPS")

    @classmethod
    def from_env(cls):
        environment = os.getenv("APP_ENV", "production")
        local = environment in {"development", "test"}
        return cls(
            database_url=os.getenv("DATABASE_URL", "sqlite:///backend/data/sidekick.db"),
            app_env=environment,
            password_policy=os.getenv("PASSWORD_POLICY", "strict"),
            cookie_secure=os.getenv("COOKIE_SECURE", "false" if local else "true").lower() == "true",
            trusted_origins=tuple(x.strip().rstrip("/") for x in os.getenv("TRUSTED_ORIGINS", "http://localhost:3000" if local else "https://localhost").split(",") if x.strip()),
        )

    @property
    def session_cookie(self):
        return "__Host-sidekick_session" if self.cookie_secure else "sidekick_session"

    @property
    def csrf_cookie(self):
        return "__Host-sidekick_csrf" if self.cookie_secure else "sidekick_csrf"
