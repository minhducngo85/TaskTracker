import { TaskPriority } from "./TaskPriority";
import { TaskStatus } from "./TaskStatus";

export interface Task {
    id :number;
    title: string;
    description?:string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo?: string;
    createdAt:string;
    updatedAt:string;
    tags:string[];

    // Position in Kanban board
    position?: number;
}