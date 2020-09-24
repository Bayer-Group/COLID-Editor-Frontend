import { Component, OnInit, Input } from '@angular/core';
import { ExtendedUriTemplateState, FetchExtendedUriTemplateMetadata, FetchExtendedUriTemplateDetails, CreateExtendedUriTemplate, EditExtendedUriTemplate, DeleteExtendedUriTemplate } from 'src/app/state/extended-uri-template.state';
import { Select, Store } from '@ngxs/store';
import { ExtendedUriTemplateResultDTO } from 'src/app/shared/models/extendedUriTemplates/extended-uri-template-result-dto';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationResult } from 'src/app/shared/models/validation/validation-result';
import { EntityBase } from 'src/app/shared/models/Entities/entity-base';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-extended-uri-template-form',
  templateUrl: './extended-uri-template-form.component.html',
  styleUrls: ['./extended-uri-template-form.component.css']
})
export class ExtendedUriTemplateFormComponent implements OnInit {
  @Select(ExtendedUriTemplateState.getExtendedUriTemplate) extendedUriTemplate$: Observable<ExtendedUriTemplateResultDTO>;

  @Select(ExtendedUriTemplateState.getExtendedUriTemplateMetadata) extendedUriTemplatepMetadata$: Observable<Array<MetaDataProperty>>;

  @Input() isNew: boolean;

  validationResult: ValidationResult;

  entityId: string;

  label = 'extended URI template';

  showOverlaySpinner = false;

  entityType = Constants.ResourceTypes.ExtendedUriTemplate;

  constructor(private store: Store, private route: ActivatedRoute, private snackBar: ColidMatSnackBarService, private router: Router) { }

  ngOnInit() {
    this.entityId = this.route.snapshot.queryParamMap.get('id');
    this.fetchingMetadata();

    if (this.entityId != null) {
      this.fetchingEntityDetails();
    }
  }

  fetchingMetadata() {
    this.store.dispatch(new FetchExtendedUriTemplateMetadata).subscribe();
  }

  fetchingEntityDetails() {
    this.store.dispatch(new FetchExtendedUriTemplateDetails(this.entityId)).subscribe();
  }

  handleCreateEntityEmitter(entity: EntityBase) {
    console.log(entity);
    this.store.dispatch(new CreateExtendedUriTemplate(entity)).subscribe(
      () => {
        this.showOverlaySpinner = false;
        this.snackBar.success('Extended URI template', 'Created successfully');
        this.router.navigate([`admin/extendedUriTemplates`]);
      },
      error => {
        this.handleResponseError(error);
      }
    );
  }

  handleEditEntityEmitter(event: any) {
    const id = event.id;
    const entityBase = event.entity;

    this.store.dispatch(new EditExtendedUriTemplate(id, entityBase)).subscribe(
      () => {
        this.showOverlaySpinner = false;
        this.snackBar.success('Extended URI template', 'Edited successfully');
        this.router.navigate([`admin/extendedUriTemplates`]);
      },
      error => {
        this.handleResponseError(error);
      });
  }

  handleDeleteEntityEmitter(id: string) {
    this.store.dispatch(new DeleteExtendedUriTemplate(id)).subscribe(
      () => {
        this.showOverlaySpinner = false;
        this.snackBar.success('Extended URI template', 'Deleted successfully');
        this.router.navigate(['admin', 'extendedUriTemplates']);
      },
      error => {
        this.handleResponseError(error);
      }
    );
  }

  handleShowOverlaySpinner(event) {
    this.showOverlaySpinner = event;
  }

  handleCancelEditEntityEmitter() {
    this.router.navigate(['admin', 'extendedUriTemplates']);
  }

  handleResponseError(error: HttpErrorResponse) {
    this.showOverlaySpinner = false;
    if (error.status === 400 && error.error && error.error.validationResult) {
      this.validationResult = error.error.validationResult;
    }
  }
}
