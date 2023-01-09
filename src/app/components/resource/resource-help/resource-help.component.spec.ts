import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResourceHelpComponent } from './resource-help.component';

describe('ResourceHelpComponent', () => {
  let component: ResourceHelpComponent;
  let fixture: ComponentFixture<ResourceHelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceHelpComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
