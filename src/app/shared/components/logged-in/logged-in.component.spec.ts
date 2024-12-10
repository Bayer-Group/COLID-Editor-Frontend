import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInComponent } from './logged-in.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { EnsureBrowserSupportService } from 'src/app/modules/browser-support/services/ensure-browser-support.service';

describe('LoggedInComponent', () => {
  let component: LoggedInComponent;
  let fixture: ComponentFixture<LoggedInComponent>;

  class MockAuthService {
    subscribeCheckAccount() {}
    redirect() {}
  }

  class MockEnsureBrowserSupportService {
    isSupported() {
      return true;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInComponent],
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

    fixture = TestBed.createComponent(LoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
