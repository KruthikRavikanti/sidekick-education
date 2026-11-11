"""Explicit local catalog import; never runs during module import."""
import argparse
import json
from pathlib import Path
from dotenv import load_dotenv

def main():
    load_dotenv(Path(__file__).resolve().parents[1] / '.env')
    parser = argparse.ArgumentParser(description='Sidekick gap engine')
    parser.add_argument('command', choices=['seed-catalog'])
    parser.add_argument('--path')
    parser.add_argument('--report')
    args = parser.parse_args()
    from backend.accounts import SecurityContext
    from .catalog import seed_catalog, DEFAULT_CATALOG
    security = SecurityContext.from_env()
    security.db.assert_migrated()
    report = seed_catalog(security.db, Path(args.path) if args.path else DEFAULT_CATALOG, now=security.clock.now())
    output = json.dumps(report, ensure_ascii=False, indent=2)
    if args.report:
        Path(args.report).write_text(output + '\n')
    print(output)

if __name__ == '__main__':
    main()
