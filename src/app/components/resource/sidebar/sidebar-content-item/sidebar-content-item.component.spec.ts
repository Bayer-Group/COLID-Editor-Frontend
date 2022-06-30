import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarContentItemComponent } from './sidebar-content-item.component';

describe('SidebarContentItemComponent', () => {
  let component: SidebarContentItemComponent;
  let fixture: ComponentFixture<SidebarContentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarContentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
