# @tmorrow_ai

Plugin marketplace for Claude Cowork, Claude Code, and Codex, with a Gemini CLI extension for Cre8.

## Plugins

| Plugin | Description |
|--------|-------------|
| **[cre8-data](./cre8-data)** | Write SQL, explore datasets, and generate insights faster. Build visualizations and dashboards, and turn raw data into clear stories for stakeholders. Includes Clerk machine authentication for auth-gated sources. |
| **[cre8](./cre8)** | Design system intelligence for the Cre8 / Innovexa component library. MCP tools for component lookup, code generation, and serving cre8-wc UIs through Python MCP servers. |

`cre8-data` is packaged for Cowork and Claude Code. `cre8` also includes a Codex plugin manifest and a Gemini CLI extension manifest.

## Installation

### Cowork

Open **Customize → Plugins → Add marketplace**, enter `https://github.com/tmorrowdev/tmorrow_ai`, then install `cre8-data` or `cre8`. See the [Cowork plugin guide](https://claude.com/docs/cowork/guide/plugins).

### Claude Code

```bash
# Add the marketplace
claude plugin marketplace add tmorrowdev/tmorrow_ai

# Install a plugin
claude plugin install cre8-data@tmorrow_ai
claude plugin install cre8@tmorrow_ai
```

### Codex

Run these commands in your terminal with a Codex CLI version that supports `codex plugin`:

```bash
codex plugin marketplace add tmorrowdev/tmorrow_ai
codex plugin add cre8@tmorrow_ai
```

Start a new Codex thread to load the skills and MCP tools. For optional specialist agents, see the [Cre8 Codex setup](./cre8/README.md#codex-1). See also the [OpenAI plugin documentation](https://developers.openai.com/codex/plugins).

### Gemini CLI

Clone the repository and install from the extension directory (the repository root is a marketplace, not a Gemini extension):

```bash
git clone https://github.com/tmorrowdev/tmorrow_ai.git
gemini extensions install ./tmorrow_ai/cre8
```

Keep the checkout available as the update source. Start a new Gemini CLI session after installation. For development, use `gemini extensions link ./tmorrow_ai/cre8` instead; linked extensions read directly from that directory. See the [Gemini extension reference](https://geminicli.com/docs/extensions/reference/).

## Upgrading

These steps update the plugins/extensions; they assume the client is already installed.

### Cowork

Open **Customize → Plugins**, find the `tmorrow_ai` marketplace, and click **Update** to pull its latest plugins. Cowork also checks for updates from the source marketplace. See the [Cowork update guide](https://claude.com/docs/cowork/guide/plugins#update-and-remove-plugins).

### Claude Code

Refresh the marketplace, then update each plugin you have installed:

```bash
claude plugin marketplace update tmorrow_ai
claude plugin update cre8-data@tmorrow_ai
claude plugin update cre8@tmorrow_ai
```

Restart Claude Code to load the updates. For automatic updates, open `/plugin`, select **Marketplaces → tmorrow_ai → Enable auto-update**. See [Claude Code plugin updates](https://code.claude.com/docs/en/discover-plugins#configure-auto-updates).

### Codex

Refresh the Git marketplace and reinstall Cre8 from the refreshed source:

```bash
codex plugin marketplace upgrade tmorrow_ai
codex plugin add cre8@tmorrow_ai
```

Start a new Codex thread afterward. To refresh all configured Git marketplaces, run `codex plugin marketplace upgrade` without a name, then rerun `codex plugin add` for the plugins you want to reinstall. If you registered a local checkout instead, update that checkout with `git pull --ff-only` before reinstalling.

### Gemini CLI

For the local installation above, pull the source checkout first, then update the installed copy (adjust the path if you cloned elsewhere):

```bash
git -C ./tmorrow_ai pull --ff-only
gemini extensions update cre8
```

Use `gemini extensions update --all` to update all installed extensions; local sources still need to be refreshed first. For a linked development extension, only pull the checkout. Start a new Gemini CLI session afterward.
