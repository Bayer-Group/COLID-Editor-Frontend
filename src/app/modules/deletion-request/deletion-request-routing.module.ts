import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DeletionRequestComponent } from './components/deletion-request/deletion-request.component';


const deletionRequestRoute = { path: '', component: DeletionRequestComponent }

const routes: Routes = [
  deletionRequestRoute
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeletionRequestRoutingModule { }
