import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemAnalyticsComponent } from './components/system-analytics/system-analytics.component';
import { SystemAnalyticsChartComponent } from './components/system-analytics-chart/system-analytics-chart.component';
import { SystemAnalyticsRoutingModule } from './system-analytics-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [SystemAnalyticsComponent, SystemAnalyticsChartComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    NgxChartsModule,
    SystemAnalyticsRoutingModule,
    SharedModule
  ],
  exports: [ ]
})
export class SystemAnalyticsModule { }
