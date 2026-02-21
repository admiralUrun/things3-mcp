import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildThingsUrl, openThingsUrl } from "../utils/url-scheme.js";

export function registerUpdateProjectTool(server: McpServer, authToken: string) {
  server.tool(
    "update-project",
    "Update an existing project in Things 3.",
    {
      id: z.string().describe("ID of the project to update (required)"),
      title: z.string().optional().describe("New title"),
      notes: z.string().optional().describe("Replace notes (max 10,000 chars)"),
      prependNotes: z.string().optional().describe("Text to prepend to notes"),
      appendNotes: z.string().optional().describe("Text to append to notes"),
      when: z.string().optional().describe("When to schedule: today, tomorrow, evening, someday, or a date (YYYY-MM-DD)"),
      deadline: z.string().optional().describe("Deadline date (YYYY-MM-DD), empty string to clear"),
      tags: z.string().optional().describe("Comma-separated tags (replaces all existing)"),
      addTags: z.string().optional().describe("Comma-separated tags to add"),
      area: z.string().optional().describe("Title of area to move to"),
      areaId: z.string().optional().describe("Area ID (overrides area)"),
      completed: z.boolean().optional().describe("Mark completed"),
      canceled: z.boolean().optional().describe("Mark canceled"),
      reveal: z.boolean().optional().describe("Navigate to the project in Things"),
      duplicate: z.boolean().optional().describe("Duplicate before updating"),
      creationDate: z.string().optional().describe("Creation date (ISO 8601)"),
      completionDate: z.string().optional().describe("Completion date (ISO 8601)"),
    },
    async (params) => {
      const url = buildThingsUrl("update-project", {
        "auth-token": authToken,
        id: params.id,
        title: params.title,
        notes: params.notes,
        "prepend-notes": params.prependNotes,
        "append-notes": params.appendNotes,
        when: params.when,
        deadline: params.deadline,
        tags: params.tags,
        "add-tags": params.addTags,
        area: params.area,
        "area-id": params.areaId,
        completed: params.completed,
        canceled: params.canceled,
        reveal: params.reveal,
        duplicate: params.duplicate,
        "creation-date": params.creationDate,
        "completion-date": params.completionDate,
      });

      await openThingsUrl(url);

      return {
        content: [
          {
            type: "text" as const,
            text: `Updated project: ${params.id}`,
          },
        ],
      };
    }
  );
}
