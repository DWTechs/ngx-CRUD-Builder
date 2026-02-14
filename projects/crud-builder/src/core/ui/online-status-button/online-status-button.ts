import { Component, Signal, inject } from "@angular/core";
import { OfflineService } from "@crud/core/utils/offline/offline.service";

@Component({
  selector: "adm-online-status-button",
  imports: [],
  template: `
    <i class="pi pi-power-off power-icon"
        [class.online]="isOnline()"
        [title]="isOnline() ? 'Online' : 'Offline'">
    </i>
  `,
  styles: [
    `    
    .power-icon {
      color: red;
      height: 18px;

      &.online {
        color: green;
      }
    }
    `,
  ],
})
export class OnlineStatusButtonComponent {
  private readonly offlineService = inject(OfflineService);

  get isOnline(): Signal<boolean> {
    return this.offlineService.isOnline;
  }
}
