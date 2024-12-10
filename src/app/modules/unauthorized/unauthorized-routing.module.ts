import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const unauthorizedRoute = { path: '', component: UnauthorizedComponent };

const routes: Routes = [unauthorizedRoute];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnauthorizedRoutingModule {}
