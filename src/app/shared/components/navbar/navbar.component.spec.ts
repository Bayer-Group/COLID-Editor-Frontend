import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { NgxsModule } from '@ngxs/store';
import { Title } from '@angular/platform-browser';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, Input } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { StatusBuildInformationDto } from '../../models/status/status-build-information-dto';
import { StatusApiService } from 'src/app/core/http/status.api.service';
import { CommonModule } from '@angular/common';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  class MockAuthService {}

  class MockColidMatSnackBarService {}

  @Component({
    selector: 'app-title',
    template: ''
  })
  class MockTitleComponent {
    @Input() iconColor: string;
  }

  class MockStatusApiService {
    getBuildInformation(): Observable<StatusBuildInformationDto> {
      return EMPTY;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, MockTitleComponent],
      imports: [
        NgxsModule.forRoot([]),
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatTooltipModule
      ],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: Title,
          useClass: Title
        },
        {
          provide: StatusApiService,
          useClass: MockStatusApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open help dialog', () => {
    const spy = spyOn(component['dialog'], 'open').and.stub();

    component.openHelpDialog();

    expect(spy).toHaveBeenCalled();
  });

  it('should toggle sidebar', () => {
    const spy = spyOn(component['store'], 'dispatch').and.returnValue(EMPTY);

    component.toggleSidebar();

    expect(spy).toHaveBeenCalled();
  });
});
