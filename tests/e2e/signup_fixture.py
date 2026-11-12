"""Reset only the synthetic browser suite's shared signup-IP rate-limit bucket.

Each family still signs up through real HTTP authentication and CSRF checks.
This helper never loads backend/.env and refuses any non-test database path.
"""
import hashlib
import os
import re
import sqlite3
import sys
import tempfile
from pathlib import Path
from urllib.parse import quote


def main():
    if os.getenv("APP_ENV") != "test" or len(sys.argv) != 2:
        raise RuntimeError("Signup fixture requires explicit browser-test configuration.")
    database_url = sys.argv[1]
    if not database_url.startswith("sqlite:///"):
        raise RuntimeError("Only an existing isolated browser-test database is allowed.")
    database = Path(database_url.removeprefix("sqlite:///"))
    if (
        not database.is_absolute()
        or not re.fullmatch(r"sidekick-e2e-[A-Za-z0-9_-]+\.sqlite3", database.name)
        or database.is_symlink()
        or not database.is_file()
        or database.resolve().parent != Path(tempfile.gettempdir()).resolve()
    ):
        raise RuntimeError("Only an existing isolated browser-test database is allowed.")
    # mode=rw prevents accidental database creation even after validation.
    uri = f"file:{quote(str(database.resolve()), safe='/')}?mode=rw"
    with sqlite3.connect(uri, uri=True, timeout=15) as connection:
        columns = {row[1] for row in connection.execute("PRAGMA table_info(rate_limits)")}
        if columns != {"key", "attempts", "window_start"}:
            raise RuntimeError("The browser-test account schema is not ready.")
        signup_key = hashlib.sha256(b"signup:127.0.0.1").hexdigest()
        connection.execute("DELETE FROM rate_limits WHERE key=?", (signup_key,))


if __name__ == "__main__":
    main()
