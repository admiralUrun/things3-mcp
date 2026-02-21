#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAddTool } from "./tools/add.js";
import { registerAddProjectTool } from "./tools/add-project.js";
import { registerUpdateTool } from "./tools/update.js";
import { registerUpdateProjectTool } from "./tools/update-project.js";
import { registerShowTool } from "./tools/show.js";
import { registerSearchTool } from "./tools/search.js";
import { registerJsonTool } from "./tools/json.js";

const server = new McpServer({
  name: "things3-mcp",
  version: "1.0.0",
});

registerAddTool(server);
registerAddProjectTool(server);
registerUpdateTool(server);
registerUpdateProjectTool(server);
registerShowTool(server);
registerSearchTool(server);
registerJsonTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
