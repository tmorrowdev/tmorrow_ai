#!/usr/bin/env python3
"""Validate cre8-data distribution parity across Claude Code, Codex, and Gemini CLI.

Each host reads a different manifest. Nothing cross-checks them at install time,
so a version bump or rename applied to one and not the others ships silently
broken. This asserts they agree.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
MARKETPLACE = ROOT.parent


def load(path):
    return json.loads((ROOT / path).read_text())


def validate():
    claude = load(".claude-plugin/plugin.json")
    codex = load(".codex-plugin/plugin.json")
    gemini = load("gemini-extension.json")
    mcp = load(".mcp.json")

    # Name is the install address on every host; it must equal the directory.
    names = {claude["name"], codex["name"], gemini["name"], ROOT.name}
    assert names == {"cre8-data"}, f"Name mismatch across manifests: {names}"

    versions = {claude["version"], codex["version"], gemini["version"]}
    assert len(versions) == 1, f"Version drift across manifests: {versions}"

    # Gemini inlines its servers; Claude Code and Codex point at .mcp.json.
    assert gemini["mcpServers"] == mcp["mcpServers"], "Gemini mcpServers out of sync with .mcp.json"
    assert (ROOT / codex["mcpServers"]).is_file(), codex["mcpServers"]
    assert (ROOT / gemini["contextFileName"]).is_file(), gemini["contextFileName"]

    # Every skill Codex would expose must actually load.
    skills_dir = ROOT / codex["skills"]
    assert skills_dir.is_dir(), codex["skills"]
    skills = sorted(p for p in skills_dir.iterdir() if p.is_dir())
    assert skills, "no skills found"
    for skill in skills:
        manifest = skill / "SKILL.md"
        assert manifest.is_file(), f"{skill.name}: missing SKILL.md"
        text = manifest.read_text()
        assert text.startswith("---"), f"{skill.name}: missing frontmatter"
        name = re.search(r"^name:\s*(\S+)\s*$", text.split("---")[1], re.M)
        assert name, f"{skill.name}: no name in frontmatter"
        assert name.group(1) == skill.name, f"{skill.name}: frontmatter name is {name.group(1)}"

    # The marketplace entry is what Claude Code and Codex resolve to install.
    entries = json.loads((MARKETPLACE / ".claude-plugin/marketplace.json").read_text())["plugins"]
    entry = next((p for p in entries if p["name"] == "cre8-data"), None)
    assert entry, "cre8-data is not listed in the marketplace manifest"
    assert (MARKETPLACE / entry["source"]).resolve() == ROOT, f"marketplace source points at {entry['source']}"

    agents = json.loads((MARKETPLACE / ".agents/plugins/marketplace.json").read_text())["plugins"]
    assert any(p["name"] == "cre8-data" for p in agents), "cre8-data missing from the Cowork marketplace manifest"

    print(
        f"Validated cre8-data {claude['version']}: 3 host manifests in agreement, "
        f"{len(skills)} skills, {len(mcp['mcpServers'])} MCP servers, 2 marketplace entries."
    )


if __name__ == "__main__":
    validate()
