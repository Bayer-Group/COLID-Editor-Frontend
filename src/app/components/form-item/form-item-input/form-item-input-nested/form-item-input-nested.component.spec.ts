import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputNestedComponent } from './form-item-input-nested.component';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from 'src/app/shared/services/form/form.service';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { Resource } from 'src/app/shared/models/resources/resource';
import { ValidationResultProperty } from 'src/app/shared/models/validation/validation-result-property';
import { ResourceCreationType as EntityCreationType } from 'src/app/shared/models/resources/resource-creation-type';

describe('FormItemInputNestedComponent', () => {
  let component: FormItemInputNestedComponent;
  let fixture: ComponentFixture<FormItemInputNestedComponent>;

  class MockFormService {
    getForm() {}
  }

  @Component({
    selector: 'app-form',
    template: ''
  })
  class MockFormComponent {
    @Input() adminPrivilege: boolean;
    @Input() readOnly: boolean;
    @Input() nestedForm: boolean;
    @Input() pidUriTemplatesFetched: Observable<boolean>;
    @Input() pidUriTemplateNames: Observable<Array<PidUriTemplateResultDTO>>;
    @Input() placeholder: any;
    @Input() isNew: boolean;
    @Input() isTypeChanging: boolean;
    @Input() formReadOnly: boolean;
    @Input() hasPublishedVersion: boolean;
    @Input() creationType: EntityCreationType;
    @Input() mainDistribution: string;
    @Input() indexerNested: number;
    @Input()
    set entity(entity: Resource) {}
    @Input() linkingMetadata: MetaDataProperty[];
    @Input()
    set metaData(metaData: MetaDataProperty[]) {}
    @Input()
    set errors(errors: ValidationResultProperty[]) {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputNestedComponent, MockFormComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {}
        },
        {
          provide: FormService,
          useClass: MockFormService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputNestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
