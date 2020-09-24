import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormItemSettings } from 'src/app/shared/models/form/form-item-settings';
import { ControlTypeMapping } from '../../../components/resource/resource-form/resource-form.constants';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialogComponent } from '../delete-item-dialog/delete-item-dialog.component';
import { ValidationResult } from 'src/app/shared/models/validation/validation-result';
import { EntityBase } from 'src/app/shared/models/Entities/entity-base';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { EntityFormService } from '../../services/entity-form/entity-form.service';

@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.css']
})
export class EntityFormComponent implements OnInit {

  @Input() label: string;

  _entity: Entity;

  @Input() set entity(entity: Entity) {
    this._entity = entity;
    this.fillForm();
  }

  @Input() metaData: Array<MetaDataProperty>;

  @Input() isNew: boolean;

  @Input() isDeletable: boolean;

  @Input() placeholder: any = {};

  @Input() deletionText: string;

  @Input() set validationResult(validationResult) {
    if (validationResult != null) {
      this.showValidationResult(validationResult);
    }
  }

  @Input() entityType: string;

  @Output() showOverlaySpinner: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() createEntityEmitter: EventEmitter<EntityBase> = new EventEmitter<EntityBase>();

  @Output() deleteEntityEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Output() editEntityEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output() cancelEditEntityEmitter: EventEmitter<any> = new EventEmitter<any>();


  constants = Constants;



  entityForm: FormGroup = null;

  formItemSettings: FormItemSettings = {
    controlTypeMapping: ControlTypeMapping,
    debounceTime: 500
  };

  get f() { return this.entityForm.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private entityFormService: EntityFormService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    const formBuilderGroup = {};

    for (const m of this.metaData) {
      formBuilderGroup[m.key] = [m.key];
    }

    this.entityForm = this.formBuilder.group(formBuilderGroup);

    for (const m of this.metaData) {
      const value = m.key === Constants.Metadata.EntityType ? this.entityType : null;
      this.entityForm.controls[m.properties[Constants.Metadata.HasPidUri]].setValue(value);
      this.fillPlaceholder();
    }

    this.fillForm();
  }

  fillPlaceholder() {
    Object.keys(this.placeholder).forEach(key => {
      const formItem = this.entityForm.controls[key];
      if (formItem) {
        formItem.setValue(this.placeholder[key]);
      }
    });
  }

  fillForm() {
    if (this._entity && this.entityForm) {
      Object.keys(this._entity.properties).forEach(key => {
        const formItem = this.entityForm.controls[key];
        if (formItem) {
          formItem.setValue(this._entity.properties[key]);
        }
      });
    }
  }

  createEntity() {
    this.showOverlaySpinner.emit(true);
    const formProperties = Object.entries(this.entityForm.value);
    const entity = this.entityFormService.createEntity(formProperties, this.metaData, this.entityType);

    this.createEntityEmitter.emit(entity);
  }

  confirmAndDelete() {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Deleting ${this.label}`,
        body: this.deletionText || `Are you sure you want to delete this ${this.label}?'`
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEntity();
      }
    });
  }

  showValidationResult(validationResult: ValidationResult) {
    validationResult.results.forEach((result) => {
      this.entityForm.controls[result.path].setErrors({ incorrect: true, result: result });
    });

  }

  deleteEntity() {
    this.showOverlaySpinner.emit(true);
    this.deleteEntityEmitter.emit(this._entity.id);
  }

  editEntity() {
    this.showOverlaySpinner.emit(true);
    const formProperties = Object.entries(this.entityForm.value);
    const entity = this.entityFormService.createEntity(formProperties, this.metaData, this.entityType);

    this.editEntityEmitter.emit({ id: this._entity.id, entity: entity });
  }

  cancelEditing() {
    this.cancelEditEntityEmitter.emit();

  }
}
