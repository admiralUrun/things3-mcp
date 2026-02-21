import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildThingsUrl, openThingsUrl } from "../utils/url-scheme.js";

export function registerUpdateTool(server: McpServer, authToken: string) {
  server.tool(
    "update",
    "Update an existing to-do in Things 3.",
    {
      id: z.string().describe("ID of the to-do to update (required)"),
      title: z.string().optional().describe("New title"),
      notes: z.string().optional().describe("Replace notes (max 10,000 chars)"),
      prependNotes: z.string().optional().describe("Text to prepend to notes"),
      appendNotes: z.string().optional().describe("Text to append to notes"),
      when: z.string().optional().describe("When to schedule: today, tomorrow, evening, someday, or a date (YYYY-MM-DD)"),
      deadline: z.string().optional().describe("Deadline date (YYYY-MM-DD), empty string to clear"),
      tags: z.string().optional().describe("Comma-separated tags (replaces all existing)"),
      addTags: z.string().optional().describe("Comma-separated tags to add"),
      checklistItems: z.string().optional().describe("Newline-separated checklist items (replaces all, max 100)"),
      prependChecklistItems: z.string().optional().describe("Newline-separated items to prepend"),
      appendChecklistItems: z.string().optional().describe("Newline-separated items to append"),
      list: z.string().optional().describe("Title of project or area to move to"),
      listId: z.string().optional().describe("ID of project or area (overrides list)"),
      heading: z.string().optional().describe("Heading within project"),
      headingId: z.string().optional().describe("Heading ID (overrides heading)"),
      completed: z.boolean().optional().describe("Mark completed/incomplete"),
      canceled: z.boolean().optional().describe("Mark canceled"),
      reveal: z.boolean().optional().describe("Navigate to the to-do in Things"),
      duplicate: z.boolean().optional().describe("Duplicate before updating"),
      creationDate: z.string().optional().describe("Creation date (ISO 8601)"),
      completionDate: z.string().optional().describe("Completion date (ISO 8601)"),
    },
    async (params) => {
      const url = buildThingsUrl("update", {
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
        "checklist-items": params.checklistItems,
        "prepend-checklist-items": params.prependChecklistItems,
        "append-checklist-items": params.appendChecklistItems,
        list: params.list,
        "list-id": params.listId,
        heading: params.heading,
        "heading-id": params.headingId,
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
            text: `Updated to-do: ${params.id}`,
          },
        ],
      };
    }
  );
}
