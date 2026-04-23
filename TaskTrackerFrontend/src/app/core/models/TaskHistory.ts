export interface TaskHistory {
  id: number;
  taskId: number;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedByFullName: string;
  changedAt: string;
}