// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';


// Internal modules
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { ColidSnackBarModule } from './modules/colid-mat-snack-bar/colid-mat-snack-bar.module';
import { ColidIconsModule } from './modules/colid-icons/colid-icons.module';


// External modules
import { BrowserSupportModule } from './modules/browser-support/browser-support.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuillModule, QuillConfig } from 'ngx-quill';


// Services
import { LogService } from './core/logging/log.service';
import { LogPublishersService } from './core/logging/log-publishers.service';
import { ResourceApiService } from './core/http/resource.api.service';
import { ReindexApiService } from './core/http/reindex.api.service';
import { StatusApiService } from './core/http/status.api.service';
import { WelcomeMessageApiService } from './core/http/welcome.message.api.service';
import { EntityApiService } from './core/http/entity.api.service';
import { GraphApiService } from './core/http/graph.api.service';
import { MessageTemplateApiService } from './core/http/message.template.api.service';
import { ColidEntryApiService } from './core/http/colid-entries.api.service';
import { GraphManagementApiService } from 'src/app/core/http/graph-management-api.service';
import { MessagesApiService } from './core/http/messages.api.service';


// States
import { ResourceOverviewState } from './state/resource-overview.state';
import { ResourceState } from './state/resource.state';
import { MetaDataState } from './state/meta-data.state';
import { ConsumerGroupState } from './state/consumer-group.state';
import { UserInfoState } from './state/user-info.state';
import { StatusState } from './state/status.state';
import { StatisticsState } from './state/statistics.state';
import { SidebarState } from './state/sidebar.state';
import { ResourceFormState } from './state/resource-form.state';
import { GraphState } from './components/admin/admin-tasks/graph/graph.state';
import { ExtendedUriTemplateState } from './state/extended-uri-template.state';
import { WelcomeMessageState } from './state/welcome-message.state';
import { MessageTemplateState } from './state/message-template.state';
import { ColidEntrySubscriberCountState} from './state/colid-entry-subcriber-count.state'

// Config
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';


// Interceptor
import { ColidDefaultInterceptor } from './core/interceptors/colid-default.interceptor';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/resource/sidebar/sidebar.component';
import { ResourceComponent } from './components/resource/resource.component';
import { ResourceFormComponent } from './components/resource/resource-form/resource-form.component';
import { ResourceDisplayComponent } from './components/resource/resource-display/resource-display.component';
import { ResourceEditComponent } from './components/resource/resource-edit/resource-edit.component';
import { ResourceNewComponent } from './components/resource/resource-new/resource-new.component';
import { ResourceWelcomeComponent } from './components/resource/resource-welcome/resource-welcome.component';
import { LoggedInComponent } from './shared/components/logged-in/logged-in.component';
import { SidebarContentComponent } from './components/resource/sidebar/sidebar-content/sidebar-content.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminTasksComponent } from './components/admin/admin-tasks/admin-tasks.component';
import { ConsumerGroupComponent } from './components/admin/admin-tasks/consumer-group/consumer-group.component';
import { AssignUserComponent } from './components/admin/admin-tasks/assign-user/assign-user.component';
import { FormItemComponent } from './components/form-item/form-item.component';
import { ConsumerGroupFormComponent } from './components/admin/admin-tasks/consumer-group/consumer-group-form/consumer-group-form.component';
import { ConsumerGroupEditComponent } from './components/admin/admin-tasks/consumer-group/consumer-group-edit/consumer-group-edit.component';
import { ConsumerGroupNewComponent } from './components/admin/admin-tasks/consumer-group/consumer-group-new/consumer-group-new.component';
import { LoginInProgressComponent } from './shared/components/login-in-progress/login-in-progress.component';
import { FormItemInputCheckboxComponent } from './components/form-item/form-item-input/form-item-input-checkbox/form-item-input-checkbox.component';
import { FormItemInputHtmlComponent } from './components/form-item/form-item-input/form-item-input-html/form-item-input-html.component';
import { FormItemInputMultiselectComponent } from './components/form-item/form-item-input/form-item-input-multiselect/form-item-input-multiselect.component';
import { FormItemInputDatetimeComponent } from './components/form-item/form-item-input/form-item-input-datetime/form-item-input-datetime.component';
import { FormItemInputGeneralComponent } from './components/form-item/form-item-input/form-item-input-general/form-item-input-general.component';
import { FormItemInputNumberComponent } from './components/form-item/form-item-input/form-item-input-number/form-item-input-number.component';
import { FormItemErrorsComponent } from './components/form-item/form-item-errors/form-item-errors.component';
import { FormItemInputBaseComponent } from './components/form-item/form-item-input/form-item-input-base/form-item-input-base.component';
import { ResourceHelpComponent } from './components/resource/resource-help/resource-help.component';
import { ConsumerGroupDisplayComponent } from './components/admin/admin-tasks/consumer-group/consumer-group-display/consumer-group-display.component';
import { PidUriTemplateComponent } from './components/admin/admin-tasks/pid-uri-template/pid-uri-template.component';
import { PidUriTemplateTableComponent } from './components/admin/admin-tasks/pid-uri-template/pid-uri-template-table/pid-uri-template-table.component';
import { ResourceHierarchyComponent } from './components/resource/resource-hierarchy/resource-hierarchy.component';
import { SidebarFilterComponent } from './components/resource/sidebar/sidebar-filter/sidebar-filter.component';
import { ResourceDisplayItemComponent } from './components/resource/resource-display/resource-display-item/resource-display-item.component';
import { FormComponent } from './components/form/form.component';
import { FormItemInputNestedComponent } from './components/form-item/form-item-input/form-item-input-nested/form-item-input-nested.component';
import { FormItemInputDistributionComponent } from './components/form-item/form-item-input/form-item-input-distribution/form-item-input-distribution.component';
import { FormItemInputPidUriComponent } from './components/form-item/form-item-input/form-item-input-pid-uri/form-item-input-pid-uri.component';
import { ResourceFormSecretDialogComponent } from './components/resource/resource-form/resource-form-secret-dialog/resource-form-secret-dialog.component';
import { DeleteItemDialogComponent } from './shared/components/delete-item-dialog/delete-item-dialog.component';
import { FormItemInputLinkingComponent } from './components/form-item/form-item-input/form-item-input-linking/form-item-input-linking.component';
import { FormItemInputLinkingDialogComponent } from './components/form-item/form-item-input/form-item-input-linking/form-item-input-linking-dialog/form-item-input-linking-dialog.component';
import { ResourceDisplayItemLinkingComponent } from './components/resource/resource-display/resource-display-item/resource-display-item-linking/resource-display-item-linking.component';
import { FormItemCreateLinkingComponent } from './components/form-item/form-item-create/form-item-create-linking/form-item-create-linking.component';
import { FormItemCreateNestedComponent } from './components/form-item/form-item-create/form-item-create-nested/form-item-create-nested.component';
import { FormItemCreateDistributionComponent } from './components/form-item/form-item-create/form-item-create-distribution/form-item-create-distribution.component';
import { ExtendedUriTemplateComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template.component';
import { ExtendedUriTemplateDisplayComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template-display/extended-uri-template-display.component';
import { ExtendedUriTemplateEditComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template-edit/extended-uri-template-edit.component';
import { ExtendedUriTemplateFormComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template-form/extended-uri-template-form.component';
import { ExtendedUriTemplateNewComponent } from './components/admin/admin-tasks/extended-uri-template/extended-uri-template-new/extended-uri-template-new.component';
import { EntityFormComponent } from './shared/components/entity-form/entity-form.component';
import { GraphComponent } from './components/admin/admin-tasks/graph/graph.component';
import { GraphFormComponent } from './components/admin/admin-tasks/graph/graph-form/graph-form.component';
import { FormItemInputGeneralMultiComponent } from './components/form-item/form-item-input/form-item-input-general-multi/form-item-input-general-multi.component';
import { ResourceHierarchyItemComponent } from './components/resource/resource-hierarchy/resource-hierarchy-item/resource-hierarchy-item.component';
import { ResourceDisplayItemDistributionComponent } from './components/resource/resource-display/resource-display-item/resource-display-item-distribution/resource-display-item-distribution.component';
import { ResourceDisplayItemDropdownComponent } from './components/resource/resource-display/resource-display-item/resource-display-item-dropdown/resource-display-item-dropdown.component';
import { SupportFeedbackBarComponent } from './shared/components/support-feedback-bar/support-feedback-bar.component';
import { GraphHistoryComponent } from './components/admin/admin-tasks/graph/graph-history/graph-history.component';
import { EntityHeaderComponent } from './shared/components/entity-header/entity-header.component';
import { EntityDisplayComponent } from './shared/components/entity-display/entity-display.component';
import { EntityDisplayItemComponent } from './shared/components/entity-display/entity-display-item/entity-display-item.component';
import { EntityDisplayItemTaxonomyComponent } from './shared/components/entity-display/entity-display-item-taxonomy/entity-display-item-taxonomy.component';
import { EntityDisplayGroupComponent } from './shared/components/entity-display/entity-display-group/entity-display-group.component';
import { EntityHistoricComponent } from './shared/components/entity-historic/entity-historic.component';
import { EntityDisplayItemVersioningComponent } from './shared/components/entity-display/entity-display-item-versioning/entity-display-item-versioning.component';
import { EntityDisplayImageComponent } from './shared/components/entity-display/entity-display-image/entity-display-image.component';
import { ResourceViewComponent } from './components/resource/resource-view/resource-view.component';
import { ResourceHistoryComponent } from './components/resource/resource-history/resource-history.component';
import { SharedModule } from './shared/shared.module';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormItemInputTaxonomyComponent } from './components/form-item/form-item-input/form-item-input-taxonomy/form-item-input-taxonomy.component';
import { TaxonomyState } from './state/taxonomy.state';
import { PidUriTemplateState } from './state/pid-uri-template.state';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { TitleComponent } from './shared/components/title/title.component';
import { WelcomeMessageComponent } from './components/admin/admin-tasks/welcome-message/welcome-message.component';
import { WelcomeMessageEditorComponent } from './components/admin/admin-tasks/welcome-message/welcome-message-editor/welcome-message-editor.component';
import { WelcomeMessageDataMarketplaceComponent } from './components/admin/admin-tasks/welcome-message/welcome-message-data-marketplace/welcome-message-data-marketplace.component';
import { WelcomeMessageFormComponent } from './components/admin/admin-tasks/welcome-message/welcome-message-form/welcome-message-form.component';
import { MatInputModule } from '@angular/material/input';
import { FormItemInputPersonComponent } from './components/form-item/form-item-input/form-item-input-person/form-item-input-person.component';
import { ResourceLockedDialogComponent } from './components/resource/resource-dialogs/resource-locked-dialog/resource-locked-dialog.component';
import { ColidEntrySubscriptionsState } from './state/colid-entry-subscription.state';
import { MessageTemplateComponent } from './components/admin/admin-tasks/message-template/message-template.component';
import { MessageTemplateEditComponent } from './components/admin/admin-tasks/message-template/message-template-edit/message-template-edit.component';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SidebarContentItemComponent } from './components/resource/sidebar/sidebar-content-item/sidebar-content-item.component';
import { FormItemInputAttachmentComponent } from './components/form-item/form-item-input/form-item-input-attachment/form-item-input-attachment.component';
import { FormItemCreateAttachmentComponent } from './components/form-item/form-item-create/form-item-create-attachment/form-item-create-attachment.component';
import { ImageViewerDialogComponent } from './shared/components/image-viewer-dialog/image-viewer-dialog.component';
import { BroadcastMessageComponent } from './components/admin/admin-tasks/broadcast-message/broadcast-message.component';
import { ResourceHistoricComponent } from './shared/components/resource-historic/resource-historic.component';
import { ResourceFormIncompatibleLinksDialogComponent } from './components/resource/resource-form/resource-form-incompatible-links-dialog/resource-form-incompatible-links-dialog.component';
import { MsalRedirectComponent } from './shared/services/msal.redirect.component';
import { BrowserCacheLocation, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalModule } from '@azure/msal-angular';
import { isIE, loggerCallback } from './modules/authentication/azure-authentication.module';
import { ExcelImportComponent } from './components/admin/admin-tasks/excel-import/excel-import/excel-import.component';

// Global quill config for form items
const globalQuillConfig: QuillConfig = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['clean'],                                        // remove formatting button
      ['link']                                          // link
    ]
  }
}
declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
      ngModule: Type<T>;
      providers?: Provider[];
  }
}
const protectedResourceMap = new Map(Object.entries(environment.adalConfig.protectedResourceMap));

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        TitleComponent,
        ResourceHelpComponent,
        SidebarComponent,
        SidebarContentComponent,
        ResourceComponent,
        ResourceFormComponent,
        ResourceDisplayComponent,
        ResourceEditComponent,
        ResourceNewComponent,
        ResourceWelcomeComponent,
        LoggedInComponent,
        SidebarContentComponent,
        AdminComponent,
        AdminTasksComponent,
        ConsumerGroupComponent,
        GraphComponent,
        AssignUserComponent,
        FormItemComponent,
        ConsumerGroupFormComponent,
        ConsumerGroupEditComponent,
        ConsumerGroupNewComponent,
        ConsumerGroupDisplayComponent,
        GraphFormComponent,
        PidUriTemplateComponent,
        LoginInProgressComponent,
        PidUriTemplateTableComponent,
        FormItemInputCheckboxComponent,
        FormItemInputHtmlComponent,
        FormItemInputMultiselectComponent,
        FormItemInputDatetimeComponent,
        FormItemInputGeneralComponent,
        FormItemInputGeneralMultiComponent,
        FormItemInputNumberComponent,
        FormItemErrorsComponent,
        FormItemInputBaseComponent,
        ResourceHierarchyComponent,
        SidebarFilterComponent,
        ResourceDisplayItemComponent,
        FormComponent,
        FormItemInputNestedComponent,
        FormItemInputDistributionComponent,
        FormItemInputAttachmentComponent,
        FormItemInputPidUriComponent,
        FormItemCreateNestedComponent,
        FormItemCreateAttachmentComponent,
        FormItemCreateDistributionComponent,
        ResourceFormSecretDialogComponent,
        DeleteItemDialogComponent,
        FormItemInputLinkingComponent,
        FormItemInputLinkingDialogComponent,
        ResourceDisplayItemLinkingComponent,
        FormItemCreateLinkingComponent,
        ExtendedUriTemplateComponent,
        ExtendedUriTemplateDisplayComponent,
        ExtendedUriTemplateEditComponent,
        ExtendedUriTemplateFormComponent,
        ExtendedUriTemplateNewComponent,
        EntityFormComponent,
        ResourceHierarchyItemComponent,
        ResourceDisplayItemDistributionComponent,
        ResourceDisplayItemDropdownComponent,
        SupportFeedbackBarComponent,
        GraphHistoryComponent,
        EntityHeaderComponent,
        EntityDisplayComponent,
        EntityDisplayItemComponent,
        EntityDisplayItemTaxonomyComponent,
        EntityDisplayItemVersioningComponent,
        EntityDisplayImageComponent,
        EntityDisplayGroupComponent,
        EntityHistoricComponent,
        ResourceViewComponent,
        ResourceHistoryComponent,
        FormItemInputTaxonomyComponent,
        WelcomeMessageComponent,
        WelcomeMessageEditorComponent,
        WelcomeMessageDataMarketplaceComponent,
        WelcomeMessageFormComponent,
        FormItemInputPersonComponent,
        ResourceLockedDialogComponent,
        MessageTemplateComponent,
        MessageTemplateEditComponent,
        SidebarContentItemComponent,
        ImageViewerDialogComponent,
        BroadcastMessageComponent,
        ResourceHistoricComponent,
        ResourceFormIncompatibleLinksDialogComponent,
        MsalRedirectComponent,
        ExcelImportComponent
    ],
    imports: [
      MsalModule.forRoot(new PublicClientApplication({//MSAL Config
        auth: {
          clientId: environment.adalConfig.clientId,
          authority: environment.adalConfig.authority,
          redirectUri: environment.adalConfig.redirectUri,
          postLogoutRedirectUri: environment.adalConfig.postLogoutRedirectUri,
          navigateToLoginRequestUrl: false,
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: isIE, // set to true for IE 11
        },
        system: {
          loggerOptions: {
            loggerCallback,
            logLevel: LogLevel.Info,
            piiLoggingEnabled: false
          },
          //allowRedirectInIframe: true,
        }
      }), {//MSAL GUard Config
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ["user.read", "openid", "profile", "email"]
        },
        loginFailedRoute: "/login-failed"
      }, {
  
        interactionType: InteractionType.Redirect,
        protectedResourceMap
      }),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        FontAwesomeModule,
        AppRoutingModule,
        MatInputModule,
        NgxsModule.forRoot([
            ResourceOverviewState,
            ResourceState,
            MetaDataState,
            ConsumerGroupState,
            GraphState,
            PidUriTemplateState,
            UserInfoState,
            StatusState,
            WelcomeMessageState,
            StatisticsState,
            SidebarState,
            ResourceFormState,
            ExtendedUriTemplateState,
            TaxonomyState,
            ColidEntrySubscriptionsState,
            MessageTemplateState,
            ColidEntrySubscriberCountState
        ]),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        NgxsLoggerPluginModule.forRoot(),
        AppMaterialModule,
        InfiniteScrollModule,
        NgxImageZoomModule,
        BrowserSupportModule,
        ColidIconsModule.forRoot(),
        ColidSnackBarModule.forRoot(),
        SharedModule,
        NotificationModule,
        QuillModule.forRoot(globalQuillConfig),
        AuthenticationModule.forRoot(),
    ],
    providers: [
        LogService,
        LogPublishersService,
        ResourceApiService,
        ReindexApiService,
        StatusApiService,
        WelcomeMessageApiService,
        EntityApiService,
        GraphApiService,
        ColidEntryApiService,
        GraphManagementApiService,
        MessageTemplateApiService,
        MessagesApiService,
        { provide: HTTP_INTERCEPTORS, useClass: ColidDefaultInterceptor, multi: true },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } }
    ],
    bootstrap: [AppComponent, MsalRedirectComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
    
})
export class AppModule { }
