import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceEditComponent } from './resource-edit.component';
import { NgxsModule } from '@ngxs/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { AuthConsumerGroupService } from 'src/app/modules/authentication/services/auth-consumer-group.service';
import { Component, Input } from '@angular/core';
import { ResourceCreationType } from 'src/app/shared/models/resources/resource-creation-type';
import { LogService } from 'src/app/core/logging/log.service';

// TODO: needs proper route mock
xdescribe('ResourceEditComponent', () => {
  let fixture: ComponentFixture<ResourceEditComponent>;
  let component: ResourceEditComponent;

  class MockLogService {
    info() {}
  }

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 'mockValue'
      }
    },
    queryParams: of({ key: 'value' })
  };

  class MockAuthConsumerGroupService {
    IsAuthorizedToEdit() {
      return EMPTY;
    }
  }

  @Component({
    selector: 'app-resource-form',
    template: ''
  })
  class MockResourceFormComponent {
    @Input() resourceType: string;
    @Input() basedResourceUri: string;
    @Input() creationType: ResourceCreationType = ResourceCreationType.NEW;
    @Input() useTemplate: boolean = false;

    @Input() isNew: boolean;
  }

  @Component({
    selector: 'app-colid-spinner',
    template: ''
  })
  class MockColidSpinnerComponent {
    @Input() diameter: number = 100;
    @Input() strokeWidth: number = 5;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceEditComponent,
        MockResourceFormComponent,
        MockColidSpinnerComponent
      ],
      imports: [NgxsModule.forRoot([]), RouterModule],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: AuthConsumerGroupService,
          useClass: MockAuthConsumerGroupService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
