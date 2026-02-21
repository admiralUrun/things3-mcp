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
claude mcp add things3-mcp -- node /path/to/things3-mcp/dist/index.js
```

Or add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "things3-mcp": {
      "command": "node",
      "args": ["/path/to/things3-mcp/dist/index.js"]
    }
  }
}
```

## Tools

### `add`
Create a new to-do. Params: `title`, `notes`, `when`, `deadline`, `tags`, `checklistItems`, `list`, `heading`, `reveal`, etc.

### `add-project`
Create a new project. Params: `title`, `notes`, `when`, `deadline`, `tags`, `area`, `todos`, `reveal`, etc.

### `update`
Update an existing to-do. Requires `id` and `authToken`. Params: `title`, `notes`, `when`, `deadline`, `tags`, `addTags`, `completed`, `canceled`, etc.

### `update-project`
Update an existing project. Requires `id` and `authToken`. Params: `title`, `notes`, `when`, `deadline`, `tags`, `area`, `completed`, `canceled`, etc.

### `show`
Show and return items from Things. Use list names (`inbox`, `today`, `anytime`, `upcoming`, `someday`, `logbook`), `all-projects`, or a specific item ID. Returns data to the LLM via AppleScript.

### `search`
Search to-dos by name. Returns matching items with details (id, status, notes, tags, due date, project).

### `json`
Advanced bulk creation/update using Things JSON format. Params: `data` (JSON array), `authToken` (for updates), `reveal`.

## Auth Token

The `update`, `update-project`, and `json` (for updates) tools require an auth token:

1. Open Things 3
2. Go to **Settings > General > Enable Things URLs**
3. Copy the auth token
4. Provide it as the `authToken` parameter when using these tools

## Testing

Test with MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```
