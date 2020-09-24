import { Component, OnInit, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemSettings } from 'src/app/shared/models/form/form-item-settings';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';
import { MetaDataPropertyIdentifier } from '../resource/resource-form/resource-form.constants';
import { Observable, of } from 'rxjs';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { MetaDataPropertyGroup } from 'src/app/shared/models/metadata/meta-data-property-group';
import { MultiselectSettings } from '../../shared/models/form/multi-select-settings';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemComponent),
      multi: true
    }
  ]
})

export class FormItemComponent implements OnInit, ControlValueAccessor {

  internalValue: any = null;
  multiselectSettings: MultiselectSettings;
  readonly = false;
  type: string;
  multiple = false;
  constants = Constants;

  @Input() name: string;
  @Input() metaData: MetaDataProperty;
  @Input() errors: any;
  @Input() fetched: boolean;

  get fetched$(): Observable<boolean> {
    return of(this.fetched);
  }

  @Input() presets: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() adminPrivilege: boolean;
  @Input() formItemSettings: FormItemSettings;
  @Input() newNestedEntities: string[];
  @Input() indexerNested: number;
  @Input() mainDistribution: boolean;

  @Input('readOnly')
  set readOnly(value: boolean) {
    this.setReadOnly(value);
  }

  @Output() removeFormItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() mainDistributionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() valueChanged: EventEmitter<FormItemChangedDTO> = new EventEmitter<FormItemChangedDTO>();

  @Input() controlSize: string;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() { }

  ngOnInit() {
    this.multiselectSettings = {
      multiple: !this.singleSelection,
      maxSelectedItems: this.limitSelection,
      disabled: this.readonly,
      addTag: this.metaData.properties[Constants.Metadata.HasPidUri] === Constants.Metadata.Keywords,
      hideSelected: true
    };
  }

  get limitSelection() {
    if (this.metaData.properties[Constants.Metadata.HasPidUri] === Constants.Metadata.EntityType) {
      return '1';
    }
    return this.metaData.properties[Constants.Metadata.MaxCount] === '1' ? null : this.metaData.properties[Constants.Metadata.MaxCount];
  }

  get singleSelection() {
    if (this.metaData.properties[Constants.Metadata.HasPidUri] === Constants.Metadata.EntityType) {
      return true;
    }
    return this.metaData.properties[Constants.Metadata.MaxCount] === '1';
  }

  setReadOnly(readOnly: boolean) {
    if (this.metaData.key === Constants.Metadata.EntityType) {
      this.readonly = true;
      return;
    }

    if (this.metaData.properties[Constants.Metadata.Group] != null && this.metaData.properties[Constants.Metadata.Group].key === Constants.Resource.Groups.TechnicalInformation) {
      this.readonly = true;
    }

    // If set from outside of the component, this overwrites the readonly group settings
    if (readOnly != null) {
      this.readonly = readOnly;
    }

    if (this.controlType === 'nested') {
      this.readonly = false;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  handleInputValueChanged(event: FormItemChangedDTO) {
    this.onChange(this.internalValue);
    this.onTouched();

    this.valueChanged.emit(event);
  }

  writeValue(value: any): void {
    if (value != null) {
      this.internalValue = this.prepareInternalValue(value);
    }
  }

  handleRemoveFormItem() {
    this.removeFormItem.emit();
  }

  handleMainDistributionChanged() {
    this.mainDistributionChanged.emit();
  }

  get controlType() {
    let compareControltype = this.formItemSettings.controlTypeMapping[this.metaData.properties[Constants.Metadata.Datatype]];

    const metadataKey = this.metaData.properties[Constants.Metadata.HasPidUri];
    const range = this.metaData.properties[Constants.Metadata.Range];

    if (metadataKey === Constants.Metadata.Keywords) {
      return 'cvDropdown';
    }

    if (metadataKey === MetaDataPropertyIdentifier.pidUri || metadataKey === MetaDataPropertyIdentifier.baseUri) {
      return 'identifier';
    }

    if (this.metaData.properties[Constants.Metadata.Pattern] === Constants.Regex.NaturalNumber) {
      compareControltype = 'number';
    }

    if (this.metaData.properties[Constants.Metadata.MaxCount] == null || this.metaData.properties[Constants.Metadata.MaxCount] != null && this.metaData.properties[Constants.Metadata.MaxCount] > 1) {
      compareControltype = 'general-multi';
    }

    if (range === Constants.Person.Type) {
      return 'person';
    }

    if (this.metaData.properties[Constants.Metadata.NodeKind] === Constants.Metadata.NodeType.IRI && range) {
      compareControltype = this.singleSelection ? 'cvDropdown' : 'taxonomy';
    }

    if (this.metaData.nestedMetadata.length !== 0) {
      compareControltype = 'nested';
    }

    const group: MetaDataPropertyGroup = this.metaData.properties[Constants.Metadata.Group];
    if (group != null && group.key === Constants.Resource.Groups.LinkTypes) {
      compareControltype = 'linking';
    }

    if ((compareControltype === 'taxonomy' || compareControltype === 'cvDropdown')) {
      this.internalValue = Array.isArray(this.internalValue) || this.internalValue == null ? this.internalValue : [this.internalValue];
    }

    return compareControltype;
  }

  prepareInternalValue(value: any) {
    if (this.singleSelection && Array.isArray(value)) {
      return value.length !== 0 ? value[0] : null
    }

    return value
  }
}
