export interface TodoItem {
  id: string;
  name: string;
  status: string;
  notes: string;
  tags: string[];
  dueDate: string;
  project: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  status: string;
  notes: string;
  tags: string[];
  dueDate: string;
  area: string;
}

export interface AreaItem {
  id: string;
  name: string;
  tags: string[];
}
