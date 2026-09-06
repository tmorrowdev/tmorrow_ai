#!/usr/bin/env python3
"""Preview/install CRE8 project agents; preserve unrelated Codex configuration."""
import argparse
import json
from pathlib import Path
import sys
import tomllib

PLUGIN_ROOT = Path(__file__).resolve().parents[1]


def planned_agents(project):
    result = []
    for source in sorted((PLUGIN_ROOT / "codex" / "agents").glob("*.toml")):
        data = tomllib.loads(source.read_text())
        # Bind installed prompts to this plugin copy, not the caller's cwd.
        instructions = (f"CRE8 plugin root: {PLUGIN_ROOT}\n"
                        "Read skill paths relative to this root.\n\n"
                        + data["developer_instructions"])
        content = (f'name = {json.dumps(data["name"])}\n'
                   f'description = {json.dumps(data["description"])}\n'
                   f'developer_instructions = {json.dumps(instructions)}\n')
        tomllib.loads(content)
        result.append((project / ".codex" / "agents" / source.name, content))
    if not result:
        raise ValueError("No bundled Codex agents found")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, required=True)
    parser.add_argument("--apply", action="store_true", help="Write previewed agents")
    args = parser.parse_args()
    project = args.project.resolve()
    if not project.is_dir():
        parser.error("--project must be an existing directory")
    changes = planned_agents(project)
    conflicts = []
    for target, content in changes:
        if target.is_symlink() or (target.exists() and target.read_text() != content):
            conflicts.append(target)
            print(f"CONFLICT {target}")
        elif target.exists():
            print(f"UNCHANGED {target}")
        else:
            print(f"CREATE {target}")
            if not args.apply:
                print(content)
    if conflicts:
        print("No files written. Review conflicting agent files before installing.", file=sys.stderr)
        return 1
    if args.apply:
        for target, content in changes:
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists():
                # Exclusive creation also avoids overwriting a file created after preflight.
                with target.open("x") as handle:
                    handle.write(content)
        print("Agents installed. Start a new Codex session in the target project.")
    else:
        print("Preview only. Add --apply to install these agents.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
