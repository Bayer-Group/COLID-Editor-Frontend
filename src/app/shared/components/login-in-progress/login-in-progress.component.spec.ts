import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInProgressComponent } from './login-in-progress.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { EnsureBrowserSupportService } from 'src/app/modules/browser-support/services/ensure-browser-support.service';

describe('LoginInProgressComponent', () => {
  let component: LoginInProgressComponent;
  let fixture: ComponentFixture<LoginInProgressComponent>;

  class MockAuthService {
    subscribeCheckAccount() {}
  }

  class MockEnsureBrowserSupportService {
    isSupported() {
      return false;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginInProgressComponent],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: EnsureBrowserSupportService,
          useClass: MockEnsureBrowserSupportService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
