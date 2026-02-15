import { Component, ViewEncapsulation } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { ExampleFormTabComponent } from "./tabs/form-tab.component";
import { InstallationTabComponent } from "./tabs/installation-tab.component";
import { PresentationTabComponent } from "./tabs/presentation-tab.component";
import { ExampleTableTabComponent } from "./tabs/table-tab.component";

@Component({
  selector: "app-doc",
  standalone: true,
  imports: [
    TabsModule,
    PresentationTabComponent,
    InstallationTabComponent,
    ExampleTableTabComponent,
    ExampleFormTabComponent,
  ],
  templateUrl: "./doc.component.html",
  styleUrls: ["./doc.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DocComponent {}
