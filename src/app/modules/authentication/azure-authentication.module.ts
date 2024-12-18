import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { IDENT_PROV } from 'src/app/shared/constants';

// Msal
//import { Configuration } from 'msal';
import {
  MsalModule,
  MsalInterceptor,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalGuardConfiguration,
  MSAL_INSTANCE
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication
} from '@azure/msal-browser';

// Guards
import { AzureIdentityProvider } from './services/azure-identity-provider.service';

// checks if the app is running on IE
export const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1 ||
  window.navigator.userAgent.indexOf('Edge') > -1;

export function loggerCallback(_logLevel: LogLevel, _message: string) {
  //console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.adalConfig.clientId,
      authority: environment.adalConfig.authority,
      redirectUri: environment.adalConfig.redirectUri,
      postLogoutRedirectUri: environment.adalConfig.postLogoutRedirectUri,
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
      storeAuthStateInCookie: isIE // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
      //allowRedirectInIframe: true,
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['openid', 'profile', 'email']
    }
  };
}
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map(
    Object.entries(environment.adalConfig.protectedResourceMap)
  );

  return {
    interactionType: InteractionType.Redirect, //TODO: Maybe adjust?
    protectedResourceMap
  };
}

const providers: Provider[] = [
  MsalGuard,
  MsalBroadcastService,
  MsalService,
  {
    provide: IDENT_PROV,
    useClass: AzureIdentityProvider
  },
  {
    provide: MSAL_INSTANCE,
    useFactory: MSALInstanceFactory
  },
  {
    provide: MSAL_INTERCEPTOR_CONFIG,
    useFactory: MSALInterceptorConfigFactory
  },
  {
    provide: MSAL_GUARD_CONFIG,
    useFactory: MSALGuardConfigFactory
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  }
];

@NgModule({
  imports: [CommonModule, MsalModule],
  providers: providers,
  exports: [MsalModule]
})
export class AzureAuthenticationModule {
  static forRoot(): ModuleWithProviders<AzureAuthenticationModule> {
    return {
      ngModule: AzureAuthenticationModule,
      providers: providers
    };
  }
}
