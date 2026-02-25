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

export function registerPlanMyDayPrompt(server: McpServer) {
  server.prompt(
    "plan-my-day",
    "Look at inbox, today, and upcoming items to help plan and schedule your day.",
    async () => {
      const [inbox, today, upcoming] = await Promise.all([
        getTodos("inbox"),
        getTodos("today"),
        getTodos("upcoming"),
      ]);

      const text = `Here's the current state of my Things 3 lists:

## Inbox (${inbox.length} items)
${formatTodos(inbox)}

## Today (${today.length} items)
${formatTodos(today)}

## Upcoming (${upcoming.length} items)
${formatTodos(upcoming)}

Please help me plan my day:
1. **Triage inbox**: For each inbox item, suggest whether to schedule it for today, later this week, someday, or delete it.
2. **Pull in upcoming**: Flag any upcoming items that are due soon or should be started today.
3. **Time-blocked schedule**: Suggest a time-blocked schedule for today's items (morning, afternoon, evening).
4. **Break down vague items**: If any to-do is too vague to act on, suggest breaking it into smaller steps.

Available MCP tools you can use to make changes:
- \`update\` — reschedule items (set \`when\` to today/tomorrow/evening/a date), rename, add tags
- \`add\` — create new to-dos if splitting items into smaller steps
- \`delete\` — remove items that are no longer needed
- \`show\` — look at other lists for more context`;

      return {
        messages: [{ role: "user" as const, content: { type: "text" as const, text } }],
      };
    }
  );
}
