import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrphanedIdentifierComponent } from './components/orphaned-identifier/orphaned-identifier.component';


const orphanedIdentifiersRoute = { path: '', component: OrphanedIdentifierComponent }

const routes: Routes = [
  orphanedIdentifiersRoute
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentifierRoutingModule { }
