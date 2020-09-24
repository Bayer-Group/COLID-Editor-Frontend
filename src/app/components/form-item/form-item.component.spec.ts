import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormItemComponent } from './form-item.component';

describe('ResourceFormItemComponent', () => {
  let component: FormItemComponent;
  let fixture: ComponentFixture<FormItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
