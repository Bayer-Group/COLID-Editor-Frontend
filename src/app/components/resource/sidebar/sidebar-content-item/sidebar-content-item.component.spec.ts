import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarContentItemComponent } from './sidebar-content-item.component';
import { Pipe, PipeTransform } from '@angular/core';

// TODO: need proper data mocks
xdescribe('SidebarContentItemComponent', () => {
  let component: SidebarContentItemComponent;
  let fixture: ComponentFixture<SidebarContentItemComponent>;

  @Pipe({
    name: 'removeWhiteSpaces'
  })
  class MockRemoveWhiteSpacesPipe implements PipeTransform {
    transform(value: any): any {
      return value;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarContentItemComponent, MockRemoveWhiteSpacesPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
