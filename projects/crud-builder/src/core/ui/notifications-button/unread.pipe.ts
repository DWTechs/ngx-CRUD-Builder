import { Pipe, PipeTransform } from "@angular/core";
import { isArray } from "@dwtechs/checkard";
import { Notification } from "@messages/data-access/notifications/notification.class";

@Pipe({ name: "unread", standalone: true })
export class UnreadPipe implements PipeTransform {
  public transform<T>(value: Notification[]): number {
    if (isArray(value)) {
      return value.filter((notif) => !notif.read).length;
    }
    return 0;
  }
}
