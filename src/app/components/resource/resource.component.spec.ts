import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceComponent } from './resource.component';
import { NgxsModule } from '@ngxs/store';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  @Component({
    selector: 'app-sidebar',
    template: ''
  })
  class MockSidebarComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceComponent, MockSidebarComponent],
      imports: [
        RouterModule,
        NoopAnimationsModule,
        FontAwesomeTestingModule,
        NgxsModule.forRoot(),
        MatSidenavModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
