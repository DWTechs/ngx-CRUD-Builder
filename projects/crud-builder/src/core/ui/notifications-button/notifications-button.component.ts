import { AsyncPipe } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { UnreadPipe } from "@core/ui/notifications-button/unread.pipe";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { NotificationSeveritiesService } from "@messages/data-access/notifications/notification-severities.service";
import { Notification } from "@messages/data-access/notifications/notification.class";
import { NotificationsService } from "@messages/data-access/notifications/notifications.service";
import { NotificationsShortlistComponent } from "@messages/ui/notifications-shortlist/notifications-shortlist.component";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { BehaviorSubject, map, switchMap } from "rxjs";

@Component({
  selector: "adm-notifications-button",
  styleUrls: ["./notifications-button.component.scss"],
  template: `
    @if (notifications$ | async; as notifications) {
      <i
        class="pi pi-bell icon"
        pBadge
        [value]="(notifications | unread) + ''"
        severity="danger"
        [badgeDisabled]="!(notifications | unread)"
        (click)="panelVisible = true">
      </i>
      <p-dialog header="Notifications"
        [(visible)]="panelVisible"
        [style]="{width: '50vw'}"
        position="top"
        [modal]="true"
        [dismissableMask]="true"
        appendTo="body">
        <adm-notifications-shortlist
          [notifications]="notifications"
          [severities]="severities()"
          [conf]="conf()"
          (updated)="onUpdated($event)"
          (closed)="panelVisible = false"/>
      </p-dialog>
    }
    `,
  imports: [
    AsyncPipe,
    ButtonModule,
    BadgeModule,
    UnreadPipe,
    DialogModule,
    NotificationsShortlistComponent,
  ],
})
export class NotificationsButtonComponent {
  private readonly notificationsService = inject(NotificationsService);
  private readonly severityService = inject(NotificationSeveritiesService);

  private readonly refresh$ = new BehaviorSubject(true);

  public readonly notifications$ = this.refresh$.pipe(
    switchMap(() => this.notificationsService.getAll()),
    map((res) => res.rows),
    map((notifications) =>
      notifications.sort((a, b) => (a.read > b.read ? 1 : -1)),
    ),
  );

  public panelVisible = false;

  public readonly severities = computed(() =>
    this.severityService.severities(),
  );

  public readonly conf = computed<StrictCrudItemOptions<Notification>[]>(() => {
    return this.notificationsService.conf({
      data: { severities: this.severities() },
    });
  });

  public onUpdated(notif: Notification) {
    this.notificationsService.update(notif).subscribe(() => {
      this.refresh$.next(true);
    });
  }
}
