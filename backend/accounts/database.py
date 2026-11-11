"""SQLite transactions serialize PIN counters and child limits across workers."""
import sqlite3
from contextlib import contextmanager
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


class Database:
    def __init__(self, url: str):
        if not url.startswith("sqlite:///"):
            raise ValueError("This local prototype supports sqlite:/// DATABASE_URL values")
        path = Path(url.removeprefix("sqlite:///"))
        self.path = path if path.is_absolute() else ROOT / path

    def connect(self):
        connection = sqlite3.connect(self.path, timeout=15, isolation_level=None)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys=ON")
        connection.execute("PRAGMA busy_timeout=15000")
        return connection

    @contextmanager
    def transaction(self):
        connection = self.connect()
        try:
            connection.execute("BEGIN IMMEDIATE")
            yield connection
            connection.commit()
        except BaseException:
            connection.rollback()
            raise
        finally:
            connection.close()

    def assert_migrated(self):
        if not self.path.is_file():
            from .security import AccountError
            raise AccountError('database_not_ready', 'Run the one-time database migration before starting Sidekick: npm run db:migrate.', 503)
        try:
            connection = self.connect()
            try:
                applied = {row[0] for row in connection.execute("SELECT version FROM schema_migrations")}
                required = {path.name for path in (ROOT / "backend" / "migrations").glob("*.sql")}
                ready = required.issubset(applied)
            finally:
                connection.close()
            if not ready:
                raise sqlite3.OperationalError()
        except sqlite3.OperationalError:
            from .security import AccountError
            raise AccountError('database_not_ready', 'Run the one-time database migration before starting Sidekick: npm run db:migrate.', 503) from None

    def migrate(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        connection = self.connect()
        try:
            connection.execute("PRAGMA journal_mode=WAL")
            connection.execute("CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY)")
        finally:
            connection.close()
        for migration in sorted((ROOT / "backend" / "migrations").glob("*.sql")):
            with self.transaction() as connection:
                if connection.execute("SELECT 1 FROM schema_migrations WHERE version=?", (migration.name,)).fetchone():
                    continue
                # Each migration contains plain SQL DDL, not external application input.
                for statement in migration.read_text().split(";"):
                    if statement.strip():
                        connection.execute(statement)
                connection.execute("INSERT INTO schema_migrations VALUES (?)", (migration.name,))
