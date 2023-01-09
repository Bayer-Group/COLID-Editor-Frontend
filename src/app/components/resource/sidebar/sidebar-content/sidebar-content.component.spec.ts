import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarContentComponent } from './sidebar-content.component';

describe('SidebarContentComponent', () => {
  let component: SidebarContentComponent;
  let fixture: ComponentFixture<SidebarContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
