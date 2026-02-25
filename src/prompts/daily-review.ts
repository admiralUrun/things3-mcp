import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTodos } from "../utils/applescript.js";
import type { TodoItem } from "../utils/types.js";

function formatTodos(todos: TodoItem[]): string {
  if (todos.length === 0) return "No to-dos found.";
  return todos
    .map((t) => {
      let line = `- ${t.name} (id: ${t.id})`;
      if (t.dueDate) line += ` | due: ${t.dueDate}`;
      if (t.tags.length > 0) line += ` | tags: ${t.tags.join(", ")}`;
      if (t.project) line += ` | project: ${t.project}`;
      if (t.notes) line += `\n  Notes: ${t.notes.substring(0, 200)}`;
      return line;
    })
    .join("\n");
}

export function registerDailyReviewPrompt(server: McpServer) {
  server.prompt(
    "daily-review",
    "Review today's to-dos and get help prioritizing, rescheduling, or cleaning up.",
    async () => {
      const today = await getTodos("today");

      const text = `Here are my Things 3 to-dos for today:

${formatTodos(today)}

Please help me review my day:
1. **Prioritize**: Rank these items by importance/urgency and suggest an order to tackle them.
2. **Reschedule**: If the day looks overloaded, suggest which items to move to tomorrow or later.
3. **Flag vague items**: Point out any to-dos that are too vague to act on and suggest clearer rewrites.
4. **Suggest deletions**: Flag any items that look stale or no longer relevant.

Available MCP tools you can use to make changes:
- \`update\` — reschedule (set \`when\`), rename, add tags, or mark complete
- \`add\` — create new to-dos if an item should be split up
- \`delete\` — remove items that are no longer needed
- \`show\` — look at other lists for more context`;

      return {
        messages: [{ role: "user" as const, content: { type: "text" as const, text } }],
      };
    }
  );
}
