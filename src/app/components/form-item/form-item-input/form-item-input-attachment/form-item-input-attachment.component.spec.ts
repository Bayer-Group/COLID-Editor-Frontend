import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputAttachmentComponent } from './form-item-input-attachment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormService } from 'src/app/shared/services/form/form.service';
import { AttachmentApiService } from 'src/app/core/http/attachment.api.service';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { Resource } from 'src/app/shared/models/resources/resource';
import { ValidationResultProperty } from 'src/app/shared/models/validation/validation-result-property';
import { ResourceCreationType as EntityCreationType } from 'src/app/shared/models/resources/resource-creation-type';

describe('FormItemInputAttachmentComponent', () => {
  let component: FormItemInputAttachmentComponent;
  let fixture: ComponentFixture<FormItemInputAttachmentComponent>;

  class MockFormService {}

  class MockAttachmentApiService {}

  class MockColidMatSnackBarService {}

  @Component({
    selector: 'app-form-item-errors',
    template: ''
  })
  class MockFormItemErrorsComponent {
    @Input() name: string;
    @Input() errors: any;
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
      declarations: [
        FormItemInputAttachmentComponent,
        MockFormItemErrorsComponent,
        MockFormComponent
      ],
      imports: [MatDialogModule],
      providers: [
        {
          provide: FormService,
          useClass: MockFormService
        },
        {
          provide: AttachmentApiService,
          useClass: MockAttachmentApiService
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
