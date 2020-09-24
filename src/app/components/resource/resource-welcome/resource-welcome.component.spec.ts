import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceWelcomeComponent } from './resource-welcome.component';

describe('ResourceWelcomeComponent', () => {
  let component: ResourceWelcomeComponent;
  let fixture: ComponentFixture<ResourceWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceWelcomeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
