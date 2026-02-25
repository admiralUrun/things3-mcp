import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAreas, createArea, deleteArea } from "../utils/applescript.js";
import type { AreaItem } from "../utils/types.js";

function formatAreas(areas: AreaItem[]): string {
  if (areas.length === 0) return "No areas found.";
  return areas
    .map((a) => {
      let line = `- ${a.name} (id: ${a.id})`;
      if (a.tags.length > 0) line += ` | tags: ${a.tags.join(", ")}`;
      return line;
    })
    .join("\n");
}

export function registerManageAreasTool(server: McpServer) {
  server.tool(
    "manage-areas",
    "Manage areas in Things 3: list all areas, create a new area, or delete an existing area.",
    {
      action: z.enum(["list", "create", "delete"]).describe("Action to perform"),
      name: z.string().optional().describe("Area name (required for create and delete)"),
      tags: z.string().optional().describe("Comma-separated tag names (for create)"),
    },
    async (params) => {
      if (params.action === "list") {
        const areas = await getAreas();
        return {
          content: [
            {
              type: "text" as const,
              text: `## Areas\n\n${formatAreas(areas)}`,
            },
          ],
        };
      }

      if (!params.name) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: "name" is required for ${params.action} action.`,
            },
          ],
          isError: true,
        };
      }

      if (params.action === "create") {
        const id = await createArea(params.name, params.tags);
        return {
          content: [
            {
              type: "text" as const,
              text: `Created area "${params.name}" (id: ${id}).`,
            },
          ],
        };
      }

      // delete
      await deleteArea(params.name);
      return {
        content: [
          {
            type: "text" as const,
            text: `Deleted area "${params.name}". Note: items previously in this area are not deleted, only the area grouping is removed.`,
          },
        ],
      };
    }
  );
}
