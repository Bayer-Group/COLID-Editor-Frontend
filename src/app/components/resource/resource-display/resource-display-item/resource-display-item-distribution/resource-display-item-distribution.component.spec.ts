import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDisplayItemDistributionComponent } from './resource-display-item-distribution.component';
import { NgxsModule } from '@ngxs/store';
import { Pipe, PipeTransform } from '@angular/core';

describe('ResourceDisplayItemDistributionComponent', () => {
  let component: ResourceDisplayItemDistributionComponent;
  let fixture: ComponentFixture<ResourceDisplayItemDistributionComponent>;

  @Pipe({
    name: 'groupBy'
  })
  class MockGroupByPipe implements PipeTransform {
    transform(collect: Array<any>): Array<any> {
      return [];
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceDisplayItemDistributionComponent, MockGroupByPipe],
      imports: [NgxsModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceDisplayItemDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
