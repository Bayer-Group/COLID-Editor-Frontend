import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Metadata } from 'src/app/shared/models/metadata/meta-data';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';
import { FormChangedDTO } from 'src/app/shared/models/form/form-changed-dto';
import { FormService } from 'src/app/shared/services/form/form.service';
import { Constants } from 'src/app/shared/constants';
import { Observable, of } from 'rxjs';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Select } from '@ngxs/store';
import { MetaDataState } from 'src/app/state/meta-data.state';

@Component({
  selector: 'app-form-item-input-distribution',
  templateUrl: './form-item-input-distribution.component.html',
  styleUrls: ['./form-item-input-distribution.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputDistributionComponent),
      multi: true
    }
  ]
})
export class FormItemInputDistributionComponent extends FormItemInputBaseComponent {
  @Select(MetaDataState.actualMetadataHasMainDistributionEndpoint)
  hasMainDistributionProperty$: Observable<boolean>;
  @Input() newDistributionEntities: string[];
  @Input() errors: any;
  @Input() metaData: Metadata[];
  @Input() label: string;
  @Input() fetched: boolean;
  @Input() presets: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() indexerNested: number;
  @Input() formReadOnly: boolean = false;

  _isMainDistribution: boolean;

  @Input() set mainDistribution(value) {
    setTimeout(() => (this._isMainDistribution = value), 100);
  }

  distributionObjects: Entity[];
  distributionTypesVisible = false;
  selectedDistributionType: Metadata = null;

  constants = Constants;
  @Output() removeFormItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() mainDistributionChanged: EventEmitter<any> =
    new EventEmitter<any>();

  get fetched$() {
    return of(this.fetched);
  }

  get distributionMetadata() {
    if (this.internalValue != null) {
      const metadata = this.metaData.find(
        (r) =>
          r.key ===
          this.internalValue.properties[Constants.Metadata.EntityType][0]
      );
      return metadata.properties;
    }
    return null;
  }

  constructor(
    private formService: FormService,
    public dialog: MatDialog
  ) {
    super();
  }

  writeValue(value: Entity): void {
    if (value != null) {
      this.internalValue = value;
    }
  }

  confirmAndRemoveDistribution() {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Deleting ${this.label}`,
        body: `Are you sure you want to delete this ${this.label}?`
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeFormItem.emit();
      }
    });
  }

  changeMainDistribution() {
    this.mainDistributionChanged.emit();
  }

  handleDistributionFormChanged(event: FormChangedDTO) {
    const entity = this.createEntity(
      event.formValue,
      this.internalValue.id,
      this.distributionMetadata
    );
    const formItemChangedDTO = new FormItemChangedDTO(event.id, entity);
    this.handleInputChange(formItemChangedDTO);
  }

  createEntity(formValues, id, metaData: MetaDataProperty[]) {
    const formProperties = Object.entries(formValues);
    const entity = this.formService.createEntity(formProperties, metaData);
    entity.id = id;
    return entity;
  }

  handleInputChange(event: FormItemChangedDTO) {
    this.handleValueChanged(event.value);

    this.valueChanged.emit(event);
  }

  handleValueChanged(publicValue: Entity) {
    this.onChange(publicValue);
    this.onTouched();
  }

  get isNewEntity() {
    return this.internalValue == null
      ? false
      : this.newDistributionEntities.includes(this.internalValue.id);
  }
}
