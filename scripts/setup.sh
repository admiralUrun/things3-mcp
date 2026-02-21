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

# Prompt for auth token
echo "To use update tools, you need an auth token from Things 3."
echo "  Things 3 > Settings > General > Enable Things URLs"
echo ""
read -rp "Paste your auth token (or press Enter to skip): " AUTH_TOKEN
echo ""

# Try Claude CLI first
if command -v claude &> /dev/null; then
  echo "Found Claude CLI. Adding MCP server..."
  if [ -n "$AUTH_TOKEN" ]; then
    claude mcp add things3-mcp --env THINGS_AUTH_TOKEN="$AUTH_TOKEN" -- "$NODE_PATH" "$SERVER_PATH"
  else
    claude mcp add things3-mcp -- "$NODE_PATH" "$SERVER_PATH"
  fi
  echo "Done! things3-mcp has been added to Claude CLI."
  echo ""
fi

# Check for Claude Desktop config
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -d "$(dirname "$CLAUDE_DESKTOP_CONFIG")" ]; then
  echo "Claude Desktop detected. Add the following to your config at:"
  echo "  $CLAUDE_DESKTOP_CONFIG"
  echo ""
  if [ -n "$AUTH_TOKEN" ]; then
    echo "  \"things3-mcp\": {"
    echo "    \"command\": \"$NODE_PATH\","
    echo "    \"args\": [\"$SERVER_PATH\"],"
    echo "    \"env\": {"
    echo "      \"THINGS_AUTH_TOKEN\": \"$AUTH_TOKEN\""
    echo "    }"
    echo "  }"
  else
    echo "  \"things3-mcp\": {"
    echo "    \"command\": \"$NODE_PATH\","
    echo "    \"args\": [\"$SERVER_PATH\"]"
    echo "  }"
  fi
  echo ""
fi

# If neither found
if ! command -v claude &> /dev/null && [ ! -d "$(dirname "$CLAUDE_DESKTOP_CONFIG")" ]; then
  echo "No Claude CLI or Claude Desktop found."
  echo ""
  echo "Manual setup:"
  echo "  Command: $NODE_PATH"
  echo "  Args:    $SERVER_PATH"
  if [ -n "$AUTH_TOKEN" ]; then
    echo "  Env:     THINGS_AUTH_TOKEN=$AUTH_TOKEN"
  fi
  echo ""
  echo "For Claude CLI:"
  if [ -n "$AUTH_TOKEN" ]; then
    echo "  claude mcp add things3-mcp --env THINGS_AUTH_TOKEN=$AUTH_TOKEN -- $NODE_PATH $SERVER_PATH"
  else
    echo "  claude mcp add things3-mcp -- $NODE_PATH $SERVER_PATH"
  fi
fi
