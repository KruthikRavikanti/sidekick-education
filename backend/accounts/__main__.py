"""Run explicit schema migrations or seed the local prototype."""
import argparse
from pathlib import Path
from dotenv import load_dotenv
from .security import SecurityContext
from .seed import seed_demo


def main():
    load_dotenv(Path(__file__).resolve().parents[1] / '.env')
    parser = argparse.ArgumentParser(description='Sidekick local account database')
    parser.add_argument('command',choices=['migrate','seed'])
    command = parser.parse_args().command
    security = SecurityContext.from_env()
    if command == 'migrate':
        security.db.migrate()
        print('Sidekick database migrations are up to date.')
    else:
        security.db.assert_migrated()
        seed_demo(security)
        print('Demo account ready: parent@example.com / password. Existing account records were preserved.')


if __name__ == '__main__':
    main()
