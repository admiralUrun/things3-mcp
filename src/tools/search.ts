import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchTodos } from "../utils/applescript.js";
import { buildThingsUrl, openThingsUrl } from "../utils/url-scheme.js";

export function registerSearchTool(server: McpServer) {
  server.tool(
    "search",
    "Search for to-dos in Things 3 by name. Returns matching items with their details.",
    {
      query: z.string().describe("Search query to find to-dos by name"),
    },
    async (params) => {
      const todos = await searchTodos(params.query);

      // Also open search in Things
      const url = buildThingsUrl("search", { query: params.query });
      await openThingsUrl(url);

      if (todos.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No to-dos found matching "${params.query}".`,
            },
          ],
        };
      }

      const formatted = todos
        .map((t) => {
          let line = `- [${t.status === "completed" ? "x" : " "}] ${t.name} (id: ${t.id})`;
          if (t.dueDate) line += ` | due: ${t.dueDate}`;
          if (t.tags.length > 0) line += ` | tags: ${t.tags.join(", ")}`;
          if (t.project) line += ` | project: ${t.project}`;
          if (t.notes) line += `\n  Notes: ${t.notes.substring(0, 200)}`;
          return line;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `## Search Results for "${params.query}"\n\nFound ${todos.length} item(s):\n\n${formatted}`,
          },
        ],
      };
    }
  );
}
