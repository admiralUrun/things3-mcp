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
import { registerDeleteTool } from "./tools/delete.js";
import { registerGetSelectedTool } from "./tools/get-selected.js";
import { registerManageAreasTool } from "./tools/manage-areas.js";
import { registerDailyReviewPrompt } from "./prompts/daily-review.js";
import { registerPlanMyDayPrompt } from "./prompts/plan-my-day.js";
import { registerWeeklyCleanupPrompt } from "./prompts/weekly-cleanup.js";
import { registerPlanProjectPrompt } from "./prompts/plan-project.js";

const server = new McpServer({
  name: "things3-mcp",
  version: "1.0.0",
});

const authToken = process.env.THINGS_AUTH_TOKEN;
if (!authToken) {
  console.error(
    "Error: THINGS_AUTH_TOKEN environment variable is not set.\n" +
    "Set it in your MCP server config. Find the token in Things 3 > Settings > General > Enable Things URLs."
  );
  process.exit(1);
}

registerAddTool(server);
registerAddProjectTool(server);
registerUpdateTool(server, authToken);
registerUpdateProjectTool(server, authToken);
registerShowTool(server);
registerSearchTool(server);
registerJsonTool(server, authToken);
registerDeleteTool(server);
registerGetSelectedTool(server);
registerManageAreasTool(server);

registerDailyReviewPrompt(server);
registerPlanMyDayPrompt(server);
registerWeeklyCleanupPrompt(server);
registerPlanProjectPrompt(server);

const transport = new StdioServerTransport();
await server.connect(transport);
