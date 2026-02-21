import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildThingsUrl, openThingsUrl } from "../utils/url-scheme.js";

export function registerJsonTool(server: McpServer, authToken: string) {
  server.tool(
    "json",
    "Create or update multiple items in Things 3 using JSON. The data should be a JSON array of to-do and project objects. See Things URL Scheme docs for the JSON format.",
    {
      data: z.string().describe("JSON array of to-do/project objects. Each object needs a 'type' field ('to-do' or 'project') and 'attributes'."),
      reveal: z.boolean().optional().describe("Navigate to the first created item"),
    },
    async (params) => {
      // Validate that data is valid JSON
      try {
        JSON.parse(params.data);
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Invalid JSON in data parameter.",
            },
          ],
          isError: true,
        };
      }

      const url = buildThingsUrl("json", {
        data: params.data,
        "auth-token": authToken,
        reveal: params.reveal,
      });

      await openThingsUrl(url);

      return {
        content: [
          {
            type: "text" as const,
            text: "Successfully sent JSON data to Things 3.",
          },
        ],
      };
    }
  );
}
