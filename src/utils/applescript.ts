import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { TodoItem, ProjectItem } from "./types.js";

const execFileAsync = promisify(execFile);

const FIELD_DELIMITER = "|||";
const RECORD_DELIMITER = "~~~";

export async function runAppleScript(script: string): Promise<string> {
  const { stdout } = await execFileAsync("osascript", ["-e", script]);
  return stdout.trim();
}

function parseTodoRecords(raw: string): TodoItem[] {
  if (!raw) return [];
  return raw.split(RECORD_DELIMITER).filter(Boolean).map((record) => {
    const fields = record.split(FIELD_DELIMITER);
    return {
      id: fields[0] ?? "",
      name: fields[1] ?? "",
      status: fields[2] ?? "",
      notes: fields[3] ?? "",
      tags: (fields[4] ?? "").split(",").filter(Boolean),
      dueDate: fields[5] ?? "",
      project: fields[6] ?? "",
    };
  });
}

function parseProjectRecords(raw: string): ProjectItem[] {
  if (!raw) return [];
  return raw.split(RECORD_DELIMITER).filter(Boolean).map((record) => {
    const fields = record.split(FIELD_DELIMITER);
    return {
      id: fields[0] ?? "",
      name: fields[1] ?? "",
      status: fields[2] ?? "",
      notes: fields[3] ?? "",
      tags: (fields[4] ?? "").split(",").filter(Boolean),
      dueDate: fields[5] ?? "",
      area: fields[6] ?? "",
    };
  });
}

const LIST_NAME_MAP: Record<string, string> = {
  inbox: "inbox",
  today: "today",
  anytime: "anytime",
  upcoming: "upcoming",
  someday: "someday",
  logbook: "logbook",
};

export async function getTodos(listName: string): Promise<TodoItem[]> {
  const normalizedList = listName.toLowerCase();
  const thingsList = LIST_NAME_MAP[normalizedList];

  if (!thingsList) {
    throw new Error(
      `Unknown list: ${listName}. Valid lists: ${Object.keys(LIST_NAME_MAP).join(", ")}`
    );
  }

  const script = `
tell application "Things3"
  set output to ""
  repeat with t in to dos of list "${thingsList}"
    set tid to id of t
    set tname to name of t
    set tstatus to status of t
    set tnotes to notes of t
    set tdue to due date of t
    set ttags to ""
    repeat with tg in tags of t
      if ttags is not "" then set ttags to ttags & ","
      set ttags to ttags & name of tg
    end repeat
    set tproject to ""
    try
      set tproject to name of project of t
    end try
    if tstatus is open then
      set stext to "open"
    else if tstatus is completed then
      set stext to "completed"
    else if tstatus is canceled then
      set stext to "canceled"
    else
      set stext to tstatus as text
    end if
    set dtext to ""
    if tdue is not missing value then
      set dtext to tdue as text
    end if
    set output to output & tid & "${FIELD_DELIMITER}" & tname & "${FIELD_DELIMITER}" & stext & "${FIELD_DELIMITER}" & tnotes & "${FIELD_DELIMITER}" & ttags & "${FIELD_DELIMITER}" & dtext & "${FIELD_DELIMITER}" & tproject & "${RECORD_DELIMITER}"
  end repeat
  return output
end tell`;

  const raw = await runAppleScript(script);
  return parseTodoRecords(raw);
}

export async function searchTodos(query: string): Promise<TodoItem[]> {
  const escaped = query.replace(/"/g, '\\"');
  const script = `
tell application "Things3"
  set output to ""
  repeat with t in to dos whose name contains "${escaped}"
    set tid to id of t
    set tname to name of t
    set tstatus to status of t
    set tnotes to notes of t
    set tdue to due date of t
    set ttags to ""
    repeat with tg in tags of t
      if ttags is not "" then set ttags to ttags & ","
      set ttags to ttags & name of tg
    end repeat
    set tproject to ""
    try
      set tproject to name of project of t
    end try
    if tstatus is open then
      set stext to "open"
    else if tstatus is completed then
      set stext to "completed"
    else if tstatus is canceled then
      set stext to "canceled"
    else
      set stext to tstatus as text
    end if
    set dtext to ""
    if tdue is not missing value then
      set dtext to tdue as text
    end if
    set output to output & tid & "${FIELD_DELIMITER}" & tname & "${FIELD_DELIMITER}" & stext & "${FIELD_DELIMITER}" & tnotes & "${FIELD_DELIMITER}" & ttags & "${FIELD_DELIMITER}" & dtext & "${FIELD_DELIMITER}" & tproject & "${RECORD_DELIMITER}"
  end repeat
  return output
end tell`;

  const raw = await runAppleScript(script);
  return parseTodoRecords(raw);
}

export async function getProjects(): Promise<ProjectItem[]> {
  const script = `
tell application "Things3"
  set output to ""
  repeat with p in projects
    set pid to id of p
    set pname to name of p
    set pstatus to status of p
    set pnotes to notes of p
    set pdue to due date of p
    set ptags to ""
    repeat with tg in tags of p
      if ptags is not "" then set ptags to ptags & ","
      set ptags to ptags & name of tg
    end repeat
    set parea to ""
    try
      set parea to name of area of p
    end try
    if pstatus is open then
      set stext to "open"
    else if pstatus is completed then
      set stext to "completed"
    else if pstatus is canceled then
      set stext to "canceled"
    else
      set stext to pstatus as text
    end if
    set dtext to ""
    if pdue is not missing value then
      set dtext to pdue as text
    end if
    set output to output & pid & "${FIELD_DELIMITER}" & pname & "${FIELD_DELIMITER}" & stext & "${FIELD_DELIMITER}" & pnotes & "${FIELD_DELIMITER}" & ptags & "${FIELD_DELIMITER}" & dtext & "${FIELD_DELIMITER}" & parea & "${RECORD_DELIMITER}"
  end repeat
  return output
end tell`;

  const raw = await runAppleScript(script);
  return parseProjectRecords(raw);
}

export async function getTodoById(id: string): Promise<TodoItem | null> {
  const escaped = id.replace(/"/g, '\\"');
  const script = `
tell application "Things3"
  try
    set t to to do id "${escaped}"
    set tid to id of t
    set tname to name of t
    set tstatus to status of t
    set tnotes to notes of t
    set tdue to due date of t
    set ttags to ""
    repeat with tg in tags of t
      if ttags is not "" then set ttags to ttags & ","
      set ttags to ttags & name of tg
    end repeat
    set tproject to ""
    try
      set tproject to name of project of t
    end try
    if tstatus is open then
      set stext to "open"
    else if tstatus is completed then
      set stext to "completed"
    else if tstatus is canceled then
      set stext to "canceled"
    else
      set stext to tstatus as text
    end if
    set dtext to ""
    if tdue is not missing value then
      set dtext to tdue as text
    end if
    return tid & "${FIELD_DELIMITER}" & tname & "${FIELD_DELIMITER}" & stext & "${FIELD_DELIMITER}" & tnotes & "${FIELD_DELIMITER}" & ttags & "${FIELD_DELIMITER}" & dtext & "${FIELD_DELIMITER}" & tproject
  on error
    return ""
  end try
end tell`;

  const raw = await runAppleScript(script);
  if (!raw) return null;
  const fields = raw.split(FIELD_DELIMITER);
  return {
    id: fields[0] ?? "",
    name: fields[1] ?? "",
    status: fields[2] ?? "",
    notes: fields[3] ?? "",
    tags: (fields[4] ?? "").split(",").filter(Boolean),
    dueDate: fields[5] ?? "",
    project: fields[6] ?? "",
  };
}
