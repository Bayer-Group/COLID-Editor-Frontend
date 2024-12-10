import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDENT_PROV } from 'src/app/shared/constants';

// Msal
import { MockIdentityProvider } from './services/mock-identity-provider.service';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: IDENT_PROV, useClass: MockIdentityProvider }]
})
export class MockAuthenticationModule {
  static forRoot(): ModuleWithProviders<MockAuthenticationModule> {
    return {
      ngModule: MockAuthenticationModule,
      providers: [{ provide: IDENT_PROV, useClass: MockIdentityProvider }]
    };
  }
}
