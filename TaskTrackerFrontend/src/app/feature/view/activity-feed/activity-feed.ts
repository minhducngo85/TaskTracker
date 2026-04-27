import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity } from '../../../core/models/Activity';
import { TimeAgoPipe } from '../../../core/pipe/TimeAgoPipe';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-feed',
  imports: [TimeAgoPipe, MatIconModule, RouterLink, CommonModule],
  templateUrl: './activity-feed.html',
  styleUrl: './activity-feed.css',
})
export class ActivityFeed {
  onClick() {
    throw new Error('Method not implemented.');
  }
  @Input() activities: any[] = [];
  @Input() activityPage: number = 0;
  @Input() totalActivityPages: number = 0;
  @Input() maxPageLimit: number = 20;

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  getActivityIcon(action: string): string {
    switch (action) {
      case 'STATUS_CHANGED':
        return 'sync';
      case 'PRIORITY_CHANGED':
        return 'flag';
      case 'ASSIGNED':
        return 'person';
      case 'DUE_DATE_CHANGED':
        return 'event';
      case 'CREATED':
        return 'open_in_new';
      case 'TITLE_CHANGED':
        return 'event_note';
      default:
        return 'edit';
    }
  }

  prevPage() {
    this.prev.emit();
  }

  nextPage() {
    this.next.emit();
  }

  trackById(index: number, item: Activity) {
    return item.id;
  }
}
