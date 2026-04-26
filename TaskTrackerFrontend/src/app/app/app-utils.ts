import { Console } from 'console';
import { Task } from '../core/models/Task';
import { TaskStatus } from '../core/models/TaskStatus';

export function isTaskOverdue(task: Task): boolean {
  if (!task?.dueDate) return false;
  if (task.status === TaskStatus.DONE) return false;

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

export function removeTimeFromUpdatedAt(task: Task): Task {
  if (!task?.updatedAt) return task;
  task.updatedAt = task.updatedAt.substring(0, 10);
  return task;
}


export function ListOfLastDays(): string[] {
  let days : string[] = [];
  const today = new Date();
  for (let i= 0; i<7; i++) {
    const day =   new Date(today);
    day.setDate(day.getDate() - (i +1));
    const str = day.toISOString().slice(0, 10);
    days.push(str);
  }
  return days.reverse();
}