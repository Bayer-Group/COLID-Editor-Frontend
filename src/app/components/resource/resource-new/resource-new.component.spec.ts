import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResourceNewComponent } from './resource-new.component';

describe('ResourceNewComponent', () => {
  let component: ResourceNewComponent;
  let fixture: ComponentFixture<ResourceNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceNewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
