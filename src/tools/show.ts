import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getTodos, getProjects, getTodoById } from "../utils/applescript.js";
import { buildThingsUrl, openThingsUrl } from "../utils/url-scheme.js";
import type { TodoItem, ProjectItem } from "../utils/types.js";

const BUILT_IN_LISTS: readonly string[] = [
  "inbox",
  "today",
  "anytime",
  "upcoming",
  "someday",
  "logbook",
  "all-projects",
];

function formatTodos(todos: TodoItem[]): string {
  if (todos.length === 0) return "No to-dos found.";
  return todos
    .map((t) => {
      let line = `- [${t.status === "completed" ? "x" : " "}] ${t.name} (id: ${t.id})`;
      if (t.dueDate) line += ` | due: ${t.dueDate}`;
      if (t.tags.length > 0) line += ` | tags: ${t.tags.join(", ")}`;
      if (t.project) line += ` | project: ${t.project}`;
      if (t.notes) line += `\n  Notes: ${t.notes.substring(0, 200)}`;
      return line;
    })
    .join("\n");
}

function formatProjects(projects: ProjectItem[]): string {
  if (projects.length === 0) return "No projects found.";
  return projects
    .map((p) => {
      let line = `- [${p.status === "completed" ? "x" : " "}] ${p.name} (id: ${p.id})`;
      if (p.dueDate) line += ` | due: ${p.dueDate}`;
      if (p.tags.length > 0) line += ` | tags: ${p.tags.join(", ")}`;
      if (p.area) line += ` | area: ${p.area}`;
      if (p.notes) line += `\n  Notes: ${p.notes.substring(0, 200)}`;
      return line;
    })
    .join("\n");
}

export function registerShowTool(server: McpServer) {
  server.tool(
    "show",
    "Show and return items from Things 3. Pick a built-in list, provide a specific item ID, or search by name.",
    {
      list: z.enum(["inbox", "today", "anytime", "upcoming", "someday", "logbook", "all-projects"]).optional().describe("A predefined Things list to show. Defaults to 'today'."),
      id: z.string().optional().describe("A specific to-do or project ID. Takes precedence over list."),
      query: z.string().optional().describe("Name of an area, project, or tag to open (ignored if id or list is set)"),
      filter: z.string().optional().describe("Comma-separated tag names to filter by"),
    },
    async (params) => {
      // id takes precedence, then list, then query, then default to "today"
      const target = params.id ?? params.list ?? params.query ?? "today";
      const normalizedTarget = target.toLowerCase();

      // Try built-in lists first
      if (BUILT_IN_LISTS.includes(normalizedTarget)) {
        const todos = await getTodos(normalizedTarget);
        const filtered = params.filter ? filterByTags(todos, params.filter) : todos;

        // Also open in Things for visual reference
        const url = buildThingsUrl("show", {
          id: normalizedTarget,
          filter: params.filter,
        });
        await openThingsUrl(url);

        return {
          content: [
            {
              type: "text" as const,
              text: `## ${normalizedTarget.charAt(0).toUpperCase() + normalizedTarget.slice(1)}\n\n${formatTodos(filtered)}`,
            },
          ],
        };
      }

      // Show all projects
      if (normalizedTarget === "all-projects" || normalizedTarget === "projects") {
        const projects = await getProjects();

        const url = buildThingsUrl("show", { id: "all-projects" });
        await openThingsUrl(url);

        return {
          content: [
            {
              type: "text" as const,
              text: `## Projects\n\n${formatProjects(projects)}`,
            },
          ],
        };
      }

      // Try as a specific item ID
      const todo = await getTodoById(target);
      if (todo) {
        const url = buildThingsUrl("show", { id: target });
        await openThingsUrl(url);

        return {
          content: [
            {
              type: "text" as const,
              text: `## To-Do Details\n\n${formatTodos([todo])}`,
            },
          ],
        };
      }

      // Fallback: open via URL scheme with query
      const url = buildThingsUrl("show", {
        id: params.id,
        query: params.query,
        filter: params.filter,
      });
      await openThingsUrl(url);

      return {
        content: [
          {
            type: "text" as const,
            text: `Opened "${target}" in Things 3. (Could not read data via AppleScript for this view.)`,
          },
        ],
      };
    }
  );
}

function filterByTags(todos: TodoItem[], filter: string): TodoItem[] {
  const filterTags = filter.split(",").map((t) => t.trim().toLowerCase());
  return todos.filter((t) =>
    filterTags.some((ft) => t.tags.some((tt) => tt.toLowerCase() === ft))
  );
}
