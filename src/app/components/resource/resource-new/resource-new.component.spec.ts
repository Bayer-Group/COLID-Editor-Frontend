import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceNewComponent } from './resource-new.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { LogService } from 'src/app/core/logging/log.service';
import { of } from 'rxjs';

// TODO: need proper route mocks
xdescribe('ResourceNewComponent', () => {
  let component: ResourceNewComponent;
  let fixture: ComponentFixture<ResourceNewComponent>;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceNewComponent],
      imports: [RouterModule, NgxsModule.forRoot()],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
