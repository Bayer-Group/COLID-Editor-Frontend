import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SystemAnalyticsComponent } from './components/system-analytics/system-analytics.component';


const systemAnalytics = { path: '', component: SystemAnalyticsComponent };

const routes: Routes = [
  systemAnalytics
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemAnalyticsRoutingModule { }
