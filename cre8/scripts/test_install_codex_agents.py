"""Exercise installation side effects using disposable projects."""
from pathlib import Path
import subprocess
import sys
import tempfile
import tomllib
import unittest

SCRIPT = Path(__file__).with_name("install_codex_agents.py")


class InstallerTests(unittest.TestCase):
    def run_install(self, root, *args):
        return subprocess.run([sys.executable, str(SCRIPT), "--project", str(root), *args],
                              capture_output=True, text=True)

    def test_preview_then_install_and_idempotency(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.assertEqual(self.run_install(root).returncode, 0)
            self.assertFalse((root / ".codex").exists())
            self.assertEqual(self.run_install(root, "--apply").returncode, 0)
            files = sorted((root / ".codex/agents").glob("*.toml"))
            self.assertEqual(len(files), 3)
            before = {f: f.read_bytes() for f in files}
            for f in files:
                data = tomllib.loads(f.read_text())
                self.assertIn(str(SCRIPT.resolve().parents[1]), data["developer_instructions"])
            self.assertEqual(self.run_install(root, "--apply").returncode, 0)
            self.assertEqual(before, {f: f.read_bytes() for f in files})

    def test_conflict_prevents_all_writes(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            agents = root / ".codex/agents"
            agents.mkdir(parents=True)
            conflict = agents / "cre8-mcp-render-debugger.toml"
            conflict.write_text("User-owned definition")
            config = root / ".codex/config.toml"
            config.write_text('model = "user-choice"\n')
            result = self.run_install(root, "--apply")
            self.assertEqual(result.returncode, 1)
            self.assertEqual(list(agents.iterdir()), [conflict])
            self.assertEqual(conflict.read_text(), "User-owned definition")
            self.assertEqual(config.read_text(), 'model = "user-choice"\n')

    def test_symlink_is_not_overwritten(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            agents = root / ".codex/agents"
            agents.mkdir(parents=True)
            original = root / "original.toml"
            original.write_text("preserve me")
            (agents / "cre8-brand-themer.toml").symlink_to(original)
            self.assertEqual(self.run_install(root, "--apply").returncode, 1)
            self.assertEqual(original.read_text(), "preserve me")


if __name__ == "__main__":
    unittest.main()
