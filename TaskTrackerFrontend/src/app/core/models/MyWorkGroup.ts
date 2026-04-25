import { Task } from "./Task";

export interface MyWorkGroup {
  overdue: Task[];
  inProgress: Task[];
  todo: Task[];
  total:number;
}