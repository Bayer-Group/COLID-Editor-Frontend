import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ResourceComponent } from './resource.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { ResourceOverviewState } from '../../state/resource-overview.state';
import { MetaDataState } from '../../state/meta-data.state';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceComponent,
        SidebarComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        FontAwesomeModule,
        FormsModule,
        NgxsModule.forRoot([ResourceOverviewState, MetaDataState]),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
