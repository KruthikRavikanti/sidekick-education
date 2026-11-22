"""Offline schema/registry export and content-safe contract validation."""
import argparse
import json
from pathlib import Path

from .models import ActivityProgram, MAX_PROGRAM_BYTES
from .registry import component_contracts
from .validator import validate_program

ROOT=Path(__file__).resolve().parents[2]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    sub=parser.add_subparsers(dest='command',required=True)
    schema=sub.add_parser('schema',help='Export authoritative JSON Schema')
    schema.add_argument('--output',type=Path)
    registry=sub.add_parser('registry',help='Export inspectable component contracts')
    registry.add_argument('--output',type=Path)
    validate=sub.add_parser('validate',help='Validate local program files without model/network/database calls')
    validate.add_argument('paths',type=Path,nargs='+')
    validate.add_argument('--skip-witness',action='store_true')
    sub.add_parser('examples',help='Validate all original contract fixtures')
    args=parser.parse_args()
    if args.command in {'schema','registry'}:
        payload=ActivityProgram.model_json_schema() if args.command=='schema' else component_contracts()
        rendered=json.dumps(payload,indent=2)+'\n'
        if args.output:args.output.write_text(rendered)
        else:print(rendered,end='')
        return 0
    paths=sorted((ROOT/'data/activity_engine_v2/examples').glob('*.json')) if args.command=='examples' else args.paths
    reports=[]
    for index,path in enumerate(paths):
        try:
            with path.open('rb') as handle:raw=handle.read(MAX_PROGRAM_BYTES+1)
            report=validate_program(raw,check_witness=not getattr(args,'skip_witness',False)).model_dump()
        except (OSError,ValueError):
            report=dict(valid=False,structural='failed',computational='not_checked',issues=[dict(code='file_unreadable',path='')])
        # Never print file names, program content, validation inputs or provider bodies.
        reports.append(dict(index=index,**report))
    print(json.dumps(dict(valid=bool(reports) and all(report['valid'] for report in reports),reports=reports),indent=2))
    return 0 if reports and all(report['valid'] for report in reports) else 1


if __name__=='__main__':raise SystemExit(main())
