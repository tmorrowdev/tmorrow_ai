#!/usr/bin/env python3
"""Validate agent parity and distribution entry points without starting models."""
import json
from pathlib import Path
import re
import tomllib

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {"cre8-brand-themer", "cre8-mcp-app-builder", "cre8-mcp-render-debugger"}


def validate():
    markdown = {f.stem: f for f in (ROOT / "agents").glob("*.md")}
    native = {f.stem: f for f in (ROOT / "codex/agents").glob("*.toml")}
    assert set(markdown) == set(native) == EXPECTED, "Agent sets differ"
    for name, source in markdown.items():
        _, header, body = source.read_text().split("---", 2)
        meta = dict(line.split(": ", 1) for line in header.strip().splitlines())
        assert set(meta) == {"name", "description"}, "Use portable frontmatter"
        data = tomllib.loads(native[name].read_text())
        assert data["name"] == meta["name"] == name
        assert data["description"] == meta["description"]
        assert data["developer_instructions"].strip() == body.strip(), name
        for relative in re.findall(r"`(skills/[^`]+)`", body):
            assert (ROOT / relative).is_file(), relative
    claude = json.loads((ROOT / ".claude-plugin/plugin.json").read_text())
    codex = json.loads((ROOT / ".codex-plugin/plugin.json").read_text())
    gemini = json.loads((ROOT / "gemini-extension.json").read_text())
    assert claude["name"] == codex["name"] == gemini["name"] == ROOT.name
    assert gemini["mcpServers"] == json.loads((ROOT / ".mcp.json").read_text())["mcpServers"]
    assert (ROOT / gemini["contextFileName"]).is_file()
    assert (ROOT / codex["skills"] / "cre8-mcp-app-workflow/SKILL.md").is_file()
    assert (ROOT / codex["mcpServers"]).is_file()
    for source in [ROOT / "skills/cre8-mcp-app-workflow/SKILL.md", ROOT / "skills/cre8-mcp-ui/SKILL.md"]:
        for target in re.findall(r"\]\(([^)]+)\)", source.read_text()):
            if "://" not in target and not target.startswith("#"):
                assert (source.parent / target.split("#")[0]).exists(), target
    print("Validated 3 shared agents, 3 Codex definitions, and all distribution entry points.")


if __name__ == "__main__":
    validate()
