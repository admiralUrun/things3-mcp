import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTodos, getProjects } from "../utils/applescript.js";
import type { TodoItem, ProjectItem } from "../utils/types.js";

function formatTodos(todos: TodoItem[]): string {
  if (todos.length === 0) return "No to-dos found.";
  return todos
    .map((t) => {
      let line = `- [${t.status === "completed" ? "x" : " "}] ${t.name} (id: ${t.id})`;
      if (t.dueDate) line += ` | due: ${t.dueDate}`;
      if (t.tags.length > 0) line += ` | tags: ${t.tags.join(", ")}`;
      if (t.project) line += ` | project: ${t.project}`;
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
      return line;
    })
    .join("\n");
}

export function registerWeeklyCleanupPrompt(server: McpServer) {
  server.prompt(
    "weekly-cleanup",
    "Review completed items and stale to-dos, and suggest archiving, rescheduling, or deleting.",
    async () => {
      const [logbook, today, someday, projects] = await Promise.all([
        getTodos("logbook"),
        getTodos("today"),
        getTodos("someday"),
        getProjects(),
      ]);

      const recentCompleted = logbook.slice(0, 50);

      const text = `Here's a snapshot of my Things 3 for a weekly review:

## Recently Completed (${recentCompleted.length} items)
${formatTodos(recentCompleted)}

## Still on Today (${today.length} items)
${formatTodos(today)}

## Someday / Maybe (${someday.length} items)
${formatTodos(someday)}

## Projects (${projects.length})
${formatProjects(projects)}

Please help me clean up:
1. **Accomplishments**: Summarize what I got done this week based on the completed items.
2. **Leftover items**: Flag any items still on "Today" that look overdue or stuck, and suggest rescheduling or breaking them down.
3. **Stale someday items**: Review the Someday list — flag items that have been sitting too long and suggest whether to schedule, rewrite, or delete them.
4. **Project health**: Check each project — flag any that seem stalled (no recent completions) or have no remaining to-dos.

Available MCP tools you can use to make changes:
- \`update\` — reschedule (set \`when\`), rename, add tags, mark complete/canceled
- \`update-project\` — update project details, mark complete/canceled
- \`add\` — create new to-dos
- \`delete\` — remove stale items
- \`show\` — look at other lists or specific items for more context`;

      return {
        messages: [{ role: "user" as const, content: { type: "text" as const, text } }],
      };
    }
  );
}
