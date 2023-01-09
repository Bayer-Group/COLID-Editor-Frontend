import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResourceEditComponent } from './resource-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceFormComponent} from '../resource-form/resource-form.component';

describe('ResourceEditComponent', () => {
  let component: ResourceEditComponent;
  let fixture: ComponentFixture<ResourceEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceEditComponent, ResourceFormComponent],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
