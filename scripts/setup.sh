#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Things 3 MCP Server - Setup"
echo "============================"
echo ""

# Check if built
if [ ! -f "$PROJECT_DIR/dist/index.js" ]; then
  echo "Building project..."
  cd "$PROJECT_DIR" && npm run build
fi

NODE_PATH="$(which node)"
SERVER_PATH="$PROJECT_DIR/dist/index.js"

# Try Claude CLI first
if command -v claude &> /dev/null; then
  echo "Found Claude CLI. Adding MCP server..."
  claude mcp add things3-mcp -- "$NODE_PATH" "$SERVER_PATH"
  echo "Done! things3-mcp has been added to Claude CLI."
  echo ""
fi

# Check for Claude Desktop config
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -d "$(dirname "$CLAUDE_DESKTOP_CONFIG")" ]; then
  echo "Claude Desktop detected. Add the following to your config at:"
  echo "  $CLAUDE_DESKTOP_CONFIG"
  echo ""
  echo "  \"things3-mcp\": {"
  echo "    \"command\": \"$NODE_PATH\","
  echo "    \"args\": [\"$SERVER_PATH\"]"
  echo "  }"
  echo ""
fi

# If neither found
if ! command -v claude &> /dev/null && [ ! -d "$(dirname "$CLAUDE_DESKTOP_CONFIG")" ]; then
  echo "No Claude CLI or Claude Desktop found."
  echo ""
  echo "Manual setup:"
  echo "  Command: $NODE_PATH"
  echo "  Args:    $SERVER_PATH"
  echo ""
  echo "For Claude CLI:"
  echo "  claude mcp add things3-mcp -- $NODE_PATH $SERVER_PATH"
fi

echo ""
echo "To use update/update-project tools, enable Things URLs:"
echo "  Things 3 > Settings > General > Enable Things URLs"
echo "  Copy the auth token and provide it when using update tools."
