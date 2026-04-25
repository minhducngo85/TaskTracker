import { Console } from 'console';
import { Task } from '../core/models/Task';

export function isTaskOverdue(task: Task): boolean {
  if (!task?.dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);

  return due < today; // 👈 clean hơn (khuyên dùng)
}

export function isTodayTask(task: Task): boolean {
  if (!task?.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due.getTime() === today.getTime();
}
