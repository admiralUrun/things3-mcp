import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getProjects, getAreas } from "../utils/applescript.js";
import type { ProjectItem, AreaItem } from "../utils/types.js";

function formatProjects(projects: ProjectItem[]): string {
  if (projects.length === 0) return "No projects found.";
  return projects
    .map((p) => {
      let line = `- ${p.name}`;
      if (p.area) line += ` (area: ${p.area})`;
      if (p.tags.length > 0) line += ` | tags: ${p.tags.join(", ")}`;
      return line;
    })
    .join("\n");
}

function formatAreas(areas: AreaItem[]): string {
  if (areas.length === 0) return "No areas found.";
  return areas
    .map((a) => {
      let line = `- ${a.name}`;
      if (a.tags.length > 0) line += ` | tags: ${a.tags.join(", ")}`;
      return line;
    })
    .join("\n");
}

export function registerPlanProjectPrompt(server: McpServer) {
  server.prompt(
    "plan-project",
    "Break down a goal or topic into a Things 3 project with actionable to-dos.",
    { goal: z.string().describe("The goal or topic to plan a project around") },
    async ({ goal }) => {
      const [projects, areas] = await Promise.all([
        getProjects(),
        getAreas(),
      ]);

      const text = `I want to plan a new Things 3 project for this goal: **${goal}**

Here's my existing Things 3 structure for context:

## Existing Projects
${formatProjects(projects)}

## Areas
${formatAreas(areas)}

Please help me plan this project:
1. **Project title**: Suggest a clear, concise project title.
2. **Break it down**: Create 5–15 actionable to-dos that will achieve the goal. Each should start with a verb and be specific enough to complete in one sitting.
3. **Organization**: Suggest which area this project belongs to (based on my existing areas above), and recommend any tags.
4. **Deadlines**: If appropriate, suggest a project deadline and due dates for key milestones.
5. **Create it**: Once the plan looks good, use the \`add-project\` tool to create the project with all the to-dos.

Available MCP tools you can use:
- \`add-project\` — create the project with to-dos (pass \`todos\` as newline-separated titles)
- \`add\` — add individual to-dos with more detail (notes, deadlines, checklists)
- \`show\` — look at existing projects or areas for more context`;

      return {
        messages: [{ role: "user" as const, content: { type: "text" as const, text } }],
      };
    }
  );
}
