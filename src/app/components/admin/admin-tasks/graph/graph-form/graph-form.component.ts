import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphResultDTO } from 'src/app/shared/models/graphs/graph-result-dto';
import { ValidationResult } from 'src/app/shared/models/validation/validation-result';
import { HttpErrorResponse } from '@angular/common/http';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { GraphState, FetchGraph, CreateGraph, FetchGraphMetadata } from '../graph.state';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { EntityBase } from 'src/app/shared/models/Entities/entity-base';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-graph-form',
  templateUrl: './graph-form.component.html',
  styleUrls: ['./graph-form.component.css']
})
export class GraphFormComponent implements OnInit {
  @Select(GraphState.getActualGraph) actualGraph$: Observable<GraphResultDTO>;
  @Select(GraphState.getGraphMetadata) graphMetadata$: Observable<Array<MetaDataProperty>>;


  showOverlaySpinner = false;

  validationResult: ValidationResult;

  entityType = Constants.ResourceTypes.MetadataGraphConfiguration;

  constructor(private store: Store, private route: ActivatedRoute, private snackbar: ColidMatSnackBarService, private router: Router) { }

  ngOnInit() { }

  handleCreateEntityEmitter(entityBase: EntityBase) {
    this.store.dispatch(new CreateGraph(entityBase)).subscribe(
      () => {
        this.store.dispatch(new FetchGraph());
        this.showOverlaySpinner = false;
        this.snackbar.success('Created', 'New metadata graph configuration created successfully');
      },
      error => {
        this.handleResponseError(error);
      });
  }

  handleShowOverlaySpinner(event) {
    this.showOverlaySpinner = event;
  }

  handleResponseError(error: HttpErrorResponse) {
    this.showOverlaySpinner = false;
    if (error.status === 400 && error.error && error.error.validationResult) {
      this.validationResult = error.error.validationResult;
    }
  }

  handleCancelEditEntityEmitter() {
    this.showOverlaySpinner = true;
    this.store.dispatch([new FetchGraphMetadata(), new FetchGraph()]).subscribe();
  }
}
