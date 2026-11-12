"""Explicit local activity-library import, separate from account migration."""
import argparse
import json
import os

from dotenv import load_dotenv

from backend.accounts.database import Database, ROOT
from .library import seed_library


def main():
    load_dotenv(ROOT / 'backend/.env')
    parser = argparse.ArgumentParser(description='Import the supplied activity sources and original examples')
    parser.add_argument('command', choices=['seed-library'])
    parser.add_argument('--database-url', default=os.getenv('DATABASE_URL', 'sqlite:///backend/data/sidekick.db'))
    args = parser.parse_args()
    database = Database(args.database_url)
    database.assert_migrated()
    print(json.dumps(seed_library(database), indent=2))


if __name__ == '__main__':
    main()
