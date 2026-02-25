import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { deleteItem } from "../utils/applescript.js";

export function registerDeleteTool(server: McpServer) {
  server.tool(
    "delete",
    "Delete a to-do or project in Things 3 (moves to Trash).",
    {
      id: z.string().describe("ID of the to-do or project to delete"),
    },
    async (params) => {
      const message = await deleteItem(params.id);
      return {
        content: [
          {
            type: "text" as const,
            text: message,
          },
        ],
      };
    }
  );
}
