# things3-mcp

MCP server for [Things 3](https://culturedcode.com/things/) macOS app. Lets AI assistants create, read, update, and search your to-dos and projects.

Uses [AppleScript](https://culturedcode.com/things/support/articles/4562654/) for reading data and the [Things URL Scheme](https://culturedcode.com/things/support/articles/2803573/) for creating/updating items.

## Installation

### From Source

```bash
git clone https://github.com/andrii/things3-mcp.git
cd things3-mcp
npm install
npm run build
```

### Setup with Claude

Run the setup script to configure Claude CLI or Claude Desktop:

```bash
./scripts/setup.sh
```

Or manually add to Claude CLI:

```bash
claude mcp add things3-mcp --env THINGS_AUTH_TOKEN=your-token -- node /path/to/things3-mcp/dist/index.js
```

Or add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "things3-mcp": {
      "command": "node",
      "args": ["/path/to/things3-mcp/dist/index.js"],
      "env": {
        "THINGS_AUTH_TOKEN": "your-token"
      }
    }
  }
}
```

## Auth Token

The server requires the `THINGS_AUTH_TOKEN` environment variable to be set. Without it, the server will not start.

1. Open Things 3
2. Go to **Settings > General > Enable Things URLs**
3. Copy the auth token
4. Set it as `THINGS_AUTH_TOKEN` in your MCP server config (see setup examples above)

## Tools

### `add`
Create a new to-do. Params: `title`, `notes`, `when`, `deadline`, `tags`, `checklistItems`, `list`, `heading`, `reveal`, etc.

### `add-project`
Create a new project. Params: `title`, `notes`, `when`, `deadline`, `tags`, `area`, `todos`, `reveal`, etc.

### `update`
Update an existing to-do. Requires `id`. Params: `title`, `notes`, `when`, `deadline`, `tags`, `addTags`, `completed`, `canceled`, etc.

### `update-project`
Update an existing project. Requires `id`. Params: `title`, `notes`, `when`, `deadline`, `tags`, `area`, `completed`, `canceled`, etc.

### `show`
Show and return items from Things. Use list names (`inbox`, `today`, `anytime`, `upcoming`, `someday`, `logbook`), `all-projects`, or a specific item ID. Returns data to the LLM via AppleScript.

### `search`
Search to-dos by name. Returns matching items with details (id, status, notes, tags, due date, project).

### `delete`
Delete a to-do or project (moves to Trash). Params: `id`.

### `get-selected`
Get the currently selected to-dos in the Things 3 UI. No params.

### `manage-areas`
Manage areas: list all, create, or delete. Params: `action` (`list`, `create`, `delete`), `name` (for create/delete), `tags` (for create).

### `json`
Advanced bulk creation/update using Things JSON format. Params: `data` (JSON array), `reveal`.

## Prompts

Pre-built conversation starters that fetch your real Things 3 data and guide the LLM through common productivity workflows.

### `daily-review`
Review today's to-dos and get help prioritizing, rescheduling, or cleaning up. No arguments.

### `plan-my-day`
Look at inbox, today, and upcoming items to help plan and schedule your day. No arguments.

### `weekly-cleanup`
Review completed items and stale to-dos, and suggest archiving, rescheduling, or deleting. No arguments.

### `plan-project`
Break down a goal or topic into a Things 3 project with actionable to-dos. Argument: `goal` (required) — the goal or topic to plan around.

## Testing

Test with MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```
