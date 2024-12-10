import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EMPTY } from 'rxjs';
import { AuthService } from './modules/authentication/services/auth.service';
import { EnsureBrowserSupportService } from './modules/browser-support/services/ensure-browser-support.service';
import { ColidIconsService } from './modules/colid-icons/services/colid-icons.service';
import { Component } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  class MockColidIconsService {
    getIcon() {}
  }

  class MockAuthService {
    isLoggedIn$ = EMPTY;
    currentName$ = EMPTY;

    cleanup() {}
  }

  class MockEnsureBrowserSupportService {
    isSupported() {
      return false;
    }
  }

  @Component({
    selector: 'ensure-browser-support',
    template: ''
  })
  class MockBrowserSupportComponent {}

  @Component({
    selector: 'app-navbar',
    template: ''
  })
  class MockNavbarComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockBrowserSupportComponent,
        MockNavbarComponent
      ],
      imports: [RouterModule, NgxsModule.forRoot()],
      providers: [
        {
          provide: Title,
          useClass: Title
        },
        {
          provide: ColidIconsService,
          useClass: MockColidIconsService
        },
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

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
