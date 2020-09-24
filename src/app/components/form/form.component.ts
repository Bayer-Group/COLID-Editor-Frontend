import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { MetaDataPropertyIdentifier, ControlTypeMapping } from '../resource/resource-form/resource-form.constants';
import { FormItemSettings } from 'src/app/shared/models/form/form-item-settings';
import { Observable } from 'rxjs';
import { ValidationResultProperty, ValidationResultPropertyType } from 'src/app/shared/models/validation/validation-result-property';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { FormChangedDTO } from 'src/app/shared/models/form/form-changed-dto';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { StringExtension } from 'src/app/shared/extensions/string.extension';
import { MetaDataPropertyGroup } from 'src/app/shared/models/metadata/meta-data-property-group';
import { Constants } from 'src/app/shared/constants';
import { Store } from '@ngxs/store';
import { SetMainDistribution } from 'src/app/state/resource.state';
import { MetadataExtension } from 'src/app/shared/extensions/metadata.extension';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Output() handleFormChanged = new EventEmitter<FormChangedDTO>();

  @Input() adminPrivilege: boolean;
  @Input() nestedForm: boolean;
  @Input() pidUriTemplatesFetched: Observable<boolean>;
  @Input() pidUriTemplateNames: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() placeholder: any;
  @Input() isNew: boolean;
  @Input() hasPublishedVersion: boolean;

  @Input() mainDistribution: string;

  @Input() indexerNested: number;

  get indexerNested_() {
    return this.indexerNested == null ? '' : this.indexerNested;
  }
  @Input()
  set entity(entity: Entity) {
    this._entity = entity;
    if (this.ontologyForm != null) {
      this.fillForm();
    }
  }
  _entity: Entity;

  @Input() linkingMetadata: MetaDataProperty[];

  @Input()
  set metaData(metaData: MetaDataProperty[]) {
    if (metaData != null) {
      this._metaData = metaData;
      this.buildForm();
    }
  }

  _metaData: MetaDataProperty[];

  @Input()
  set errors(errors: ValidationResultProperty[]) {
    this.removeDuplicateValidationErrors();

    if (errors != null) {
      this.showValidationResult(errors, this._entity.id);
    }
  }

  constants = Constants;
  pidUriConstant = Constants.Metadata.HasPidUri;
  ontologyForm: FormGroup = null;

  newNestedEntities = new Array<string>();
  formItemSettings: FormItemSettings = {
    controlTypeMapping: ControlTypeMapping,
    debounceTime: 500
  };

  get f(): { [p: string]: AbstractControl } { return this.ontologyForm.controls; }

  constructor(private formBuilder: FormBuilder, private store: Store
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    if (this._entity && this._metaData) {
      const formBuilderGroup = {};
      for (const m of this._metaData) {
        if (m.nestedMetadata.length !== 0) {
          formBuilderGroup[m.properties[this.pidUriConstant]] = new FormArray([]);
        } else {
          formBuilderGroup[m.properties[this.pidUriConstant]] = this.formBuilder.control(this.placeholder[m.properties[this.pidUriConstant]]);
        }
      }
      this.ontologyForm = this.formBuilder.group(formBuilderGroup);

      this.fillForm();
    }
  }

  isIgnoredProperty(m: MetaDataProperty) {
    return MetadataExtension.isIgnoredProperty(m) || m.key === Constants.Metadata.MainDistribution;
  }

  fillForm() {
    if (this._entity && this._entity.properties) {


      Object.keys(this._entity.properties).forEach(key => {
        const formItem = this.ontologyForm.controls[key];
        const value = this._entity.properties[key];
        if (formItem && formItem instanceof FormControl) {
          formItem.setValue(value);
        }

        if (formItem && formItem instanceof FormArray) {
          if (Array.isArray(value)) {
            formItem.controls.splice(0, formItem.controls.length);
            value.forEach(entity => {
              formItem.push(this.formBuilder.control(entity));
              if (this.isNew) {
                this.newNestedEntities.push(entity.id);
              }
            });
          }
        }
      });

      if (!this.nestedForm) {
        this.handleFormChanged.emit(new FormChangedDTO(null, null, this.ontologyForm.value, true, true));
      }
    }
  }

  handleCreateNestedEntity(formControlKey: string, entity: Entity) {
    const formItem = this.ontologyForm.controls[formControlKey];
    if (formItem && formItem instanceof FormArray) {
      formItem.push(this.formBuilder.control(entity));
      this.newNestedEntities.push(entity.id);
      this.handleFormChanged.emit(new FormChangedDTO(formControlKey, entity, this.ontologyForm.value, true));
    }
  }

  handleRemoveFormItem(formControlKey: string, index: number) {
    const formArray = this.ontologyForm.controls[formControlKey];
    if (formArray && formArray instanceof FormArray) {
      formArray.removeAt(index);
    }
    this.handleFormChanged.emit(new FormChangedDTO(formControlKey, null, this.ontologyForm.value, true));
  }

  handleMainDistributionChanged(control: FormControl) {
    this.store.dispatch(new SetMainDistribution(control.value.id)).subscribe();
  }

  isFormItemReadOnly(metadata: MetaDataProperty) {
    const metadataKey = metadata.properties[this.pidUriConstant];
    if (this.adminPrivilege) {
      if (metadataKey === Constants.Metadata.HasConsumerGroup) {
        return false;
      }
    }

    if (metadataKey === MetaDataPropertyIdentifier.pidUri || metadataKey === MetaDataPropertyIdentifier.baseUri) {
      return !this.isNew;
    }

    if (metadataKey === Constants.Metadata.EntityType) {
      return true;
    }

    return null;
  }

  handleResourceFormItemChange(event: FormItemChangedDTO, main: boolean) {
    console.log('status:', this.ontologyForm);
    this.handleFormChanged.emit(new FormChangedDTO(event.id, event.value, this.ontologyForm.value, true));
  }

  removeDuplicateValidationErrors() {
    if (this.ontologyForm == null) { return; }

    Object.keys(this.ontologyForm.controls).forEach(key => {
      const formArray = this.ontologyForm.controls[key];
      const error: ValidationResultProperty = formArray.getError('result');
      if (error != null && error.type === ValidationResultPropertyType.DUPLICATE) {
        formArray.setErrors(null);
      }

      if (formArray instanceof FormArray) {
        Object.keys(formArray.controls).forEach(key2 => {
          const formItem = formArray.controls[key2];
          const formItemError: ValidationResultProperty = formItem.getError('result');
          if (Array.isArray(formItemError)) {
            formItem.setErrors({ incorrect: false, result: formItemError.filter(t => t.type !== ValidationResultPropertyType.DUPLICATE) });
          }
        });
      }
    });
  }

  showValidationResult(results: ValidationResultProperty[], id: string) {
    results.forEach((result) => {
      if (result.node == null || StringExtension.ExtractGuid(result.node) === StringExtension.ExtractGuid(id)) {
        const control = this.ontologyForm.controls[result.path];
        if (control) {
          control.setErrors({ incorrect: true, result: result });
        }
      } else {
        Object.keys(this.ontologyForm.controls).forEach(key => {
          const formArray = this.ontologyForm.controls[key];
          if (formArray instanceof FormArray) {
            Object.keys(formArray.controls).forEach(key2 => {
              const formItem: FormArray = formArray.controls[key2];
              if (formItem.value != null && formItem.value.id != null && formItem.value.id === result.node) {
                setTimeout(() => {
                  formItem.setErrors({ incorrect: false, result: [result] });
                  formItem.markAsDirty();
                });
              }
            });
          }
        });
      }
    });
  }

  isLinkingGroup(metadata: MetaDataProperty) {
    const group: MetaDataPropertyGroup = metadata.properties[Constants.Metadata.Group];

    return group != null && group.key === Constants.Resource.Groups.LinkTypes;
  }

  // event { metadata: MetaDataProperty, resource: ResourceOverviewDTO }
  handleLinkingEvent(event) {
    const metadataKey = event.metadata.properties[this.pidUriConstant];
    const formItem = this.ontologyForm.controls[metadataKey];

    if (formItem && formItem instanceof FormControl) {
      var newValue = [event.resource.pidUri];

      if (formItem.value) {
        newValue = newValue.concat(Array.isArray(formItem.value) ? formItem.value : [formItem.value]);
      }

      formItem.setValue(newValue);
      this.handleFormChanged.emit(new FormChangedDTO(metadataKey, newValue, this.ontologyForm.value, true));
    }

  }
}
