import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const time = new Date(value.endsWith('Z') ? value : value + 'Z').getTime();
    const now = new Date().getTime();

    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return `${diff} seconds ago`;

    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    if (diff < 2592000) {
      const days = Math.floor(diff / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    const months = Math.floor(diff / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}