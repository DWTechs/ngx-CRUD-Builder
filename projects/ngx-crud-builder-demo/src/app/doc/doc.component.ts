import { Component, ViewEncapsulation } from "@angular/core";
import { TabsModule } from "@openng/optimus-ui/tabs";
import { ExampleFormTabComponent } from "./ui/form-tab.component";
import { InstallationTabComponent } from "./ui/installation-tab.component";
import { PresentationTabComponent } from "./ui/presentation-tab.component";
import { ExampleTableTabComponent } from "./ui/table-tab.component";

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
