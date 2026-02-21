import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildThingsUrl, openThingsUrl } from "../utils/url-scheme.js";

export function registerAddTool(server: McpServer) {
  server.tool(
    "add",
    "Create a new to-do in Things 3",
    {
      title: z.string().describe("Title of the to-do"),
      titles: z.string().optional().describe("Newline-separated titles to create multiple to-dos (overrides title)"),
      notes: z.string().optional().describe("Notes for the to-do (max 10,000 chars)"),
      when: z.string().optional().describe("When to schedule: today, tomorrow, evening, anytime, someday, or a date (YYYY-MM-DD)"),
      deadline: z.string().optional().describe("Deadline date (YYYY-MM-DD)"),
      tags: z.string().optional().describe("Comma-separated tag names"),
      checklistItems: z.string().optional().describe("Newline-separated checklist items (max 100)"),
      list: z.string().optional().describe("Title of a project or area to add to"),
      listId: z.string().optional().describe("ID of a project or area (overrides list)"),
      heading: z.string().optional().describe("Heading within a project to add under"),
      headingId: z.string().optional().describe("ID of heading (overrides heading)"),
      completed: z.boolean().optional().describe("Mark as completed"),
      canceled: z.boolean().optional().describe("Mark as canceled"),
      reveal: z.boolean().optional().describe("Navigate to the new to-do in Things"),
      creationDate: z.string().optional().describe("Creation date (ISO 8601)"),
      completionDate: z.string().optional().describe("Completion date (ISO 8601)"),
    },
    async (params) => {
      const url = buildThingsUrl("add", {
        title: params.title,
        titles: params.titles,
        notes: params.notes,
        when: params.when,
        deadline: params.deadline,
        tags: params.tags,
        "checklist-items": params.checklistItems,
        list: params.list,
        "list-id": params.listId,
        heading: params.heading,
        "heading-id": params.headingId,
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
            text: `Created to-do: "${params.titles ?? params.title}"`,
          },
        ],
      };
    }
  );
}
