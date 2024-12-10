import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { ResourceComponent } from './components/resource/resource.component';
import { ResourceDisplayComponent } from './components/resource/resource-display/resource-display.component';
import { ResourceNewComponent } from './components/resource/resource-new/resource-new.component';
import { ResourceEditComponent } from './components/resource/resource-edit/resource-edit.component';
import { LoginInProgressComponent } from './shared/components/login-in-progress/login-in-progress.component';
import { LoggedInComponent } from './shared/components/logged-in/logged-in.component';
import { ResourceHierarchyComponent } from './components/resource/resource-hierarchy/resource-hierarchy.component';
import { ResourceViewComponent } from './components/resource/resource-view/resource-view.component';
import { ResourceHistoryComponent } from './components/resource/resource-history/resource-history.component';
import { AuthGuardEditorService } from './modules/authentication/guards/auth-guard-editor.service';
import { CanDeactivateGuard } from './core/guards/can-deactivate/can-deactivate.guard';
import { AuthGuardService } from './modules/authentication/guards/auth-guard.service';

const resourceRoute: Route = {
  path: 'resource',
  component: ResourceComponent,
  children: [
    {
      path: 'new',
      component: ResourceNewComponent,
      canDeactivate: [CanDeactivateGuard],
      canActivate: [AuthGuardEditorService]
    },
    {
      path: 'hierarchy',
      component: ResourceHierarchyComponent,
      canActivate: [AuthGuardEditorService]
    },
    {
      path: 'edit',
      component: ResourceEditComponent,
      canDeactivate: [CanDeactivateGuard]
    },
    {
      path: '',
      component: ResourceViewComponent,
      children: [
        { path: 'history', component: ResourceHistoryComponent },
        { path: '', pathMatch: 'full', component: ResourceDisplayComponent }
      ]
    }
  ],
  canActivate: [AuthGuardService]
};

const unavailableRoute = {
  path: 'unavailable',
  loadChildren: () =>
    import('./modules/system-unavailable/system-unavailable.module').then(
      (m) => m.SystemUnavailableModule
    )
};
const unauthorizedRoute = {
  path: 'unauthorized',
  loadChildren: () =>
    import('./modules/unauthorized/unauthorized.module').then(
      (m) => m.UnauthorizedModule
    )
};
const loggedInRoute = { path: 'logged-in', component: LoggedInComponent };
const loginInProgressRoute = {
  path: 'login-in-progress',
  component: LoginInProgressComponent
};
const catchAll = { path: '**', redirectTo: '/resource/hierarchy' };

const routes: Routes = [
  resourceRoute,
  unauthorizedRoute,
  unavailableRoute,
  loggedInRoute,
  loginInProgressRoute,
  catchAll
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
