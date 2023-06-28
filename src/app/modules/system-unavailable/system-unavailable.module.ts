import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemUnavailableComponent } from "./pages/system-unavailable/system-unavailable.component";
import { SystemUnavailableRoutingModule } from "./system-unavailable-routing.module";

@NgModule({
  declarations: [SystemUnavailableComponent],
  imports: [CommonModule, SystemUnavailableRoutingModule],
})
export class SystemUnavailableModule {}
