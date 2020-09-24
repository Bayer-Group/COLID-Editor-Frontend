import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHistoricComponent } from './entity-historic.component';

describe('EntityHistoricComponent', () => {
  let component: EntityHistoricComponent;
  let fixture: ComponentFixture<EntityHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
