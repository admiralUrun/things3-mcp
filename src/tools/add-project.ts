import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildThingsUrl, openThingsUrl } from "../utils/url-scheme.js";

export function registerAddProjectTool(server: McpServer) {
  server.tool(
    "add-project",
    "Create a new project in Things 3",
    {
      title: z.string().describe("Title of the project"),
      notes: z.string().optional().describe("Project notes (max 10,000 chars)"),
      when: z.string().optional().describe("When to schedule: today, tomorrow, evening, anytime, someday, or a date (YYYY-MM-DD)"),
      deadline: z.string().optional().describe("Deadline date (YYYY-MM-DD)"),
      tags: z.string().optional().describe("Comma-separated tag names"),
      area: z.string().optional().describe("Title of an area to add to"),
      areaId: z.string().optional().describe("ID of area (overrides area)"),
      todos: z.string().optional().describe("Newline-separated to-do titles to create inside the project"),
      completed: z.boolean().optional().describe("Mark as completed"),
      canceled: z.boolean().optional().describe("Mark as canceled"),
      reveal: z.boolean().optional().describe("Navigate to the new project in Things"),
      creationDate: z.string().optional().describe("Creation date (ISO 8601)"),
      completionDate: z.string().optional().describe("Completion date (ISO 8601)"),
    },
    async (params) => {
      const url = buildThingsUrl("add-project", {
        title: params.title,
        notes: params.notes,
        when: params.when,
        deadline: params.deadline,
        tags: params.tags,
        area: params.area,
        "area-id": params.areaId,
        "to-dos": params.todos,
        completed: params.completed,
        canceled: params.canceled,
        reveal: params.reveal,
        "creation-date": params.creationDate,
        "completion-date": params.completionDate,
      });

      await openThingsUrl(url);

      return {
        content: [
          {
            type: "text" as const,
            text: `Created project: "${params.title}"`,
          },
        ],
      };
    }
  );
}
