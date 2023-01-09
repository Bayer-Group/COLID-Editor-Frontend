import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarFilterComponent } from './sidebar-filter.component';

describe('SidebarFilterComponent', () => {
  let component: SidebarFilterComponent;
  let fixture: ComponentFixture<SidebarFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
