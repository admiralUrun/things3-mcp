import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getSelectedTodos } from "../utils/applescript.js";
import type { TodoItem } from "../utils/types.js";

function formatTodos(todos: TodoItem[]): string {
  if (todos.length === 0) return "No to-dos selected.";
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

export function registerGetSelectedTool(server: McpServer) {
  server.tool(
    "get-selected",
    "Get the currently selected to-dos in the Things 3 UI.",
    {},
    async () => {
      const todos = await getSelectedTodos();
      return {
        content: [
          {
            type: "text" as const,
            text: `## Selected To-Dos\n\nFound ${todos.length} item(s):\n\n${formatTodos(todos)}`,
          },
        ],
      };
    }
  );
}
