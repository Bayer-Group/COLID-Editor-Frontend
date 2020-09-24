import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GraphManagementComponent } from './graph-management.component';


const graphManagementRoute = { path: '', component: GraphManagementComponent }

const routes: Routes = [
  graphManagementRoute
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphManagementRoutingModule { }
