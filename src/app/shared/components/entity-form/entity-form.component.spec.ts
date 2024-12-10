import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormComponent } from './entity-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { EntityFormService } from '../../services/entity-form/entity-form.service';

// TODO: needs proper data mocks
xdescribe('EntityFormComponent', () => {
  let component: EntityFormComponent;
  let fixture: ComponentFixture<EntityFormComponent>;

  class MockEntityFormService {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityFormComponent],
      imports: [MatDialogModule, FormsModule],
      providers: [
        {
          provide: EntityFormService,
          useClass: MockEntityFormService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
