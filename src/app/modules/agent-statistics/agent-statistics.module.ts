import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgentStatisticsRoutingModule } from "./agent-statistics-routing.module";
import { AgentStatisticsOverviewComponent } from "./agent-statistics-overview/agent-statistics-overview.component";
import { AppMaterialModule } from "src/app/app-material.module";
import { AgentStatisticsCrawlerDetailsComponent } from "./agent-statistics-crawler-details/agent-statistics-crawler-details.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AgentStatisticsLineChartComponent } from "./agent-statistics-crawler-details/agent-statistics-line-chart/agent-statistics-line-chart.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    AgentStatisticsOverviewComponent,
    AgentStatisticsCrawlerDetailsComponent,
    AgentStatisticsLineChartComponent,
  ],
  imports: [
    CommonModule,
    AgentStatisticsRoutingModule,
    AppMaterialModule,
    SharedModule,
    NgxChartsModule,
  ],
})
export class AgentStatisticsModule {}
