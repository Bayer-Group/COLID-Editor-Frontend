import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { ResourceComponent } from './components/resource/resource.component';
import { ResourceDisplayComponent } from './components/resource/resource-display/resource-display.component';
import { ResourceNewComponent } from './components/resource/resource-new/resource-new.component';
import { ResourceEditComponent } from './components/resource/resource-edit/resource-edit.component';
import { ResourceWelcomeComponent } from './components/resource/resource-welcome/resource-welcome.component';
import { AdminComponent } from './components/admin/admin.component';
import { ConsumerGroupComponent } from './components/admin/admin-tasks/consumer-group/consumer-group.component';
import { ConsumerGroupNewComponent } from './components/admin/admin-tasks/consumer-group/consumer-group-new/consumer-group-new.component';
import { ConsumerGroupEditComponent } from './components/admin/admin-tasks/consumer-group/consumer-group-edit/consumer-group-edit.component';
import { ConsumerGroupDisplayComponent } from './components/admin/admin-tasks/consumer-group/consumer-group-display/consumer-group-display.component';
import { PidUriTemplateComponent } from './components/admin/admin-tasks/pid-uri-template/pid-uri-template.component';
import { LoginInProgressComponent } from './shared/components/login-in-progress/login-in-progress.component';
import { LoggedInComponent } from './shared/components/logged-in/logged-in.component';
import { ResourceHierarchyComponent } from './components/resource/resource-hierarchy/resource-hierarchy.component';
import { ResourceHelpComponent } from './components/resource/resource-help/resource-help.component';
import { ExtendedUriTemplateDisplayComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template-display/extended-uri-template-display.component';
import { ExtendedUriTemplateEditComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template-edit/extended-uri-template-edit.component';
import { ExtendedUriTemplateNewComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template-new/extended-uri-template-new.component';
import { ExtendedUriTemplateComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template.component';
import { GraphComponent } from './components/admin/admin-tasks/graph/graph.component';
import { GraphHistoryComponent } from './components/admin/admin-tasks/graph/graph-history/graph-history.component';
import { GraphFormComponent } from './components/admin/admin-tasks/graph/graph-form/graph-form.component';
import { AssignUserComponent } from './components/admin/admin-tasks/assign-user/assign-user.component';
import { ResourceViewComponent } from './components/resource/resource-view/resource-view.component';
import { ResourceHistoryComponent } from './components/resource/resource-history/resource-history.component';
import { WelcomeMessageComponent } from './components/admin/admin-tasks/welcome-message/welcome-message.component';
import { WelcomeMessageEditorComponent } from './components/admin/admin-tasks/welcome-message/welcome-message-editor/welcome-message-editor.component';
import { WelcomeMessageDataMarketplaceComponent } from './components/admin/admin-tasks/welcome-message/welcome-message-data-marketplace/welcome-message-data-marketplace.component';
import { MessageTemplateComponent } from './components/admin/admin-tasks/message-template/message-template.component';
import { AuthGuardEditorService } from './modules/authentication/guards/auth-guard-editor.service';
import { CanDeactivateGuard } from './core/guards/can-deactivate/can-deactivate.guard';
import { AuthGuardSuperAdminService } from './modules/authentication/guards/auth-guard-super-admin.service';
import { AuthGuardService } from './modules/authentication/guards/auth-guard.service';
import { AuthGuardAdminService } from './modules/authentication/guards/auth-guard-admin.service';
import { BroadcastMessageComponent } from './components/admin/admin-tasks/broadcast-message/broadcast-message.component';
import { ExcelImportComponent } from './components/admin/admin-tasks/excel-import/excel-import/excel-import.component';

const resourceRoute: Route = {
  path: 'resource', component: ResourceComponent, children: [
    { path: 'welcome', component: ResourceWelcomeComponent },
    { path: 'new', component: ResourceNewComponent, canDeactivate: [CanDeactivateGuard] ,canActivate: [AuthGuardEditorService]},
    { path: 'hierarchy', component: ResourceHierarchyComponent ,canActivate: [AuthGuardEditorService]},
    { path: 'help', component: ResourceHelpComponent },
    { path: 'edit', component: ResourceEditComponent, canDeactivate: [CanDeactivateGuard] },
    {
      path: '', component: ResourceViewComponent, children: [
        { path: 'history', component: ResourceHistoryComponent },
        { path: '', pathMatch: 'full', component: ResourceDisplayComponent }
      ]
    }
  ],
  canActivate: [AuthGuardService]
};

const adminRoute: Route = {
  path: 'admin', component: AdminComponent, children: [
    {
      path: 'messageTemplates', component: MessageTemplateComponent,
      canActivate: [AuthGuardSuperAdminService]
    },
    {
      path: 'welcomeMessage', component: WelcomeMessageComponent, children: [
        { path: 'edit/editor', component: WelcomeMessageEditorComponent },
        { path: 'edit/datamarketplace', component: WelcomeMessageDataMarketplaceComponent },
        { path: 'edit', pathMatch: 'full', redirectTo: 'edit/editor' },
        { path: '', pathMatch: 'full', redirectTo: 'edit/editor' }
      ],
      canActivate: [AuthGuardSuperAdminService]
    },
    {
      path: 'broadcastMessage', component: BroadcastMessageComponent,
      canActivate: [AuthGuardSuperAdminService]
    },
    {
      path: 'excelimport', component: ExcelImportComponent,
      canActivate: [AuthGuardSuperAdminService]
    },
    {
      path: 'metadata', component: GraphComponent, children: [
        { path: 'history', component: GraphHistoryComponent },
        { path: '', pathMatch: 'full', component: GraphFormComponent }
      ],
      canActivate: [AuthGuardSuperAdminService]
    },
    {
      path: 'graph',
      loadChildren: () => import('./modules/graph-management/graph-management.module').then(m => m.GraphManagementModule),
      canActivate: [AuthGuardSuperAdminService]
    },
    {
      path: 'consumerGroups', component: ConsumerGroupComponent, children: [
        { path: 'create', component: ConsumerGroupNewComponent },
        { path: 'edit', component: ConsumerGroupEditComponent },
        { path: '', pathMatch: 'full', component: ConsumerGroupDisplayComponent }
      ]
    },
    {
      path: 'extendedUriTemplates', component: ExtendedUriTemplateComponent, children: [
        { path: 'create', component: ExtendedUriTemplateNewComponent },
        { path: 'edit', component: ExtendedUriTemplateEditComponent },
        { path: '', pathMatch: 'full', component: ExtendedUriTemplateDisplayComponent }
      ]
    },
    { path: 'pidUriTemplates', component: PidUriTemplateComponent },
    { path: 'assignuser', component: AssignUserComponent },
    {
      path: 'deletionrequests',
      loadChildren: () => import('./modules/deletion-request/deletion-request.module').then(m => m.DeletionRequestModule)
    },
    {
      path: 'orphanedIdentifiers',
      loadChildren: () => import('./modules/identifier/identifier.module').then(m => m.IdentifierModule),
      canActivate: [AuthGuardSuperAdminService]
    },
    { path: '', pathMatch: 'full', redirectTo: '/admin/consumerGroups' }
  ],
  canActivate: [AuthGuardAdminService]
};

const systemAnalytics = { path: 'systemanalytics', loadChildren: () => import('./modules/system-analytics/system-analytics.module').then(m => m.SystemAnalyticsModule) };
const unavailableRoute = { path: 'unavailable', loadChildren: () => import('./modules/system-unavailable/system-unavailable.module').then(m => m.SystemUnavailableModule) };
const unauthorizedRoute = { path: 'unauthorized', loadChildren: () => import('./modules/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule) };
const userPreferencesRoute = {
  path: 'user', loadChildren: () => import('./modules/user-preferences/user-preferences.module').then(m => m.UserPreferencesModule),
  canActivate: [AuthGuardService]
}
const loggedInRoute = { path: 'logged-in', component: LoggedInComponent };
const loginInProgressRoute = { path: 'login-in-progress', component: LoginInProgressComponent };
const catchAll = { path: '**', redirectTo: '/resource/welcome' };

const routes: Routes = [
  resourceRoute,
  systemAnalytics,
  unauthorizedRoute,
  unavailableRoute,
  loggedInRoute,
  loginInProgressRoute,
  adminRoute,
  userPreferencesRoute,
  catchAll
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
