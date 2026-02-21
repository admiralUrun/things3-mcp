import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export function buildThingsUrl(
  command: string,
  params: Record<string, string | boolean | undefined>
): string {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([key, value]) => {
      const k = encodeURIComponent(key);
      const v =
        typeof value === "boolean"
          ? value
            ? "true"
            : "false"
          : encodeURIComponent(String(value));
      return `${k}=${v}`;
    })
    .join("&");

  return query ? `things:///${command}?${query}` : `things:///${command}`;
}

export async function openThingsUrl(url: string): Promise<void> {
  await execFileAsync("open", [url]);
}
