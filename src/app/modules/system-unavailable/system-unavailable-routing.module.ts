import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SystemUnavailableComponent } from './pages/system-unavailable/system-unavailable.component';

const unavailableRoute = { path: '', component: SystemUnavailableComponent };

const routes: Routes = [unavailableRoute];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemUnavailableRoutingModule {}
