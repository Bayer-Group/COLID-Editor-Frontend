import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { KeywordManagementConfirmationDialogComponent } from "../keyword-management-confirmation-dialog/keyword-management-confirmation-dialog.component";
import { Select, Store } from "@ngxs/store";
import {
  FetchGraphKeywordUsage,
  FetchGraphTypeInstanceGraph,
  FetchKeywordGraphs,
  KeywordManagementState,
  ResetGraphKeywordUsageData,
} from "src/app/state/keyword-management.state";
import { Observable, Subscription } from "rxjs";
import { GraphKeywordUsage } from "src/app/shared/models/keyword-management/graph-keyword-usage-dto";
import { MatPaginator } from "@angular/material/paginator";
import { Guid } from "guid-typescript";
import { ColidMatSnackBarService } from "../../colid-mat-snack-bar/colid-mat-snack-bar.service";

@Component({
  selector: "app-keyword-management",
  templateUrl: "./keyword-management.component.html",
  styleUrls: ["./keyword-management.component.css"],
})
export class KeywordManagementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  masterSub: Subscription = new Subscription();
  @Select(KeywordManagementState.getKeywordGraphsPidUris)
  keywordGraphPidUris$: Observable<string[]>;
  selectedKeywordGraphPidUri: string | null = null;
  @Select(KeywordManagementState.getGraphTypeSelectedInstanceGraph)
  graphTypeSelectedInstanceGraph$: Observable<string>;

  @Select(KeywordManagementState.getSelectedKeywordGraphUsage)
  keywordsGraphUsage$: Observable<GraphKeywordUsage[]>;
  @Select(KeywordManagementState.getKeywordGraphLoading)
  isLoading$: Observable<boolean>;

  dataSource: MatTableDataSource<GraphKeywordUsage>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ["label", "usage", "actions"];

  newKeyword: string = "";

  rowToEditId: string | null = null;
  editedRowLabel: string = "";

  rowsToAdd: GraphKeywordUsage[] = [];
  rowsToEdit: GraphKeywordUsage[] = [];
  rowsToDelete: GraphKeywordUsage[] = [];

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private snackBar: ColidMatSnackBarService
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchKeywordGraphs());
    this.masterSub.add(
      this.keywordsGraphUsage$.subscribe(
        (keywordsGraphTable: GraphKeywordUsage[]) => {
          this.dataSource = new MatTableDataSource(keywordsGraphTable);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.rowsToAdd = [];
          this.rowsToEdit = [];
          this.rowsToDelete = [];
        }
      )
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSelectedKeywordGraph(keywordGraphPidUri) {
    this.store.dispatch([
      new FetchGraphKeywordUsage(keywordGraphPidUri),
      new FetchGraphTypeInstanceGraph(keywordGraphPidUri),
    ]);
  }

  dropdownSearchFilter(term: string, item: string): boolean {
    return item.toLowerCase().includes(term);
  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addNewRow() {
    const duplicate = this.dataSource.data.find(
      (r) => r.label.toLowerCase() === this.newKeyword.trim().toLowerCase()
    );
    if (duplicate) {
      this.snackBar.error(
        "Keyword Duplicate",
        "A keyword with this label already exists"
      );
    } else {
      const itemToAdd = {
        keyId: Guid.create().toString(),
        label: this.newKeyword.trim(),
        usage: 0,
      };
      this.dataSource.data = [itemToAdd, ...this.dataSource.data];
      this.rowsToAdd.push(itemToAdd);
      this.newKeyword = "";
    }
  }

  saveRowChanges(keywordId: string) {
    if (this.checkForDuplicate()) {
      this.snackBar.error(
        "Keyword Duplicate",
        "A keyword with this label already exists"
      );
    } else {
      const rowToEdit = this.dataSource.data.find((r) => r.keyId === keywordId);
      rowToEdit.label = this.editedRowLabel.trim();
      const addedRowsIndex = this.rowsToAdd.findIndex(
        (r) => r.keyId === keywordId
      );
      if (addedRowsIndex !== -1) {
        this.rowsToAdd[addedRowsIndex].label = this.editedRowLabel;
      } else {
        const editedRowsIndex = this.rowsToEdit.findIndex(
          (r) => r.keyId === keywordId
        );
        if (editedRowsIndex !== -1) {
          this.rowsToEdit[editedRowsIndex].label = this.editedRowLabel;
        } else {
          this.rowsToEdit.push(rowToEdit);
        }
      }
      this.rowToEditId = null;
    }
  }

  private checkForDuplicate() {
    return this.dataSource.data.filter(
      (r) =>
        r.label.toLowerCase() === this.editedRowLabel.trim().toLowerCase() &&
        r.keyId !== this.rowToEditId
    ).length > 0
      ? true
      : false;
  }

  removeRow(row) {
    const updatedData = this.dataSource.data.filter(
      (element) => element.keyId !== row.keyId
    );
    this.dataSource.data = updatedData;
    const addedRowsIndex = this.rowsToAdd.findIndex(
      (r) => r.keyId === row.keyId
    );
    if (addedRowsIndex === -1) {
      this.rowsToDelete.push(row);
    } else {
      this.rowsToAdd.splice(addedRowsIndex, 1);
    }
  }

  confirmChanges() {
    const graphType = this.store.selectSnapshot(
      KeywordManagementState.getGraphTypeSelectedInstanceGraph
    );
    const dialogRef = this.dialog.open(
      KeywordManagementConfirmationDialogComponent,
      {
        data: {
          graphPidUri: this.selectedKeywordGraphPidUri,
          graphType: graphType,
          itemsAdded: this.rowsToAdd,
          itemsEdited: this.rowsToEdit,
          itemsDeleted: this.rowsToDelete,
        },
        width: "40vw",
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.newlyCreatedGraphUri) {
        this.snackBar.success(
          "Graph successfully created",
          `The newly created graph version was stored with the URI ${res.newlyCreatedGraphUri}`
        );
        this.rowsToAdd = [];
        this.rowsToEdit = [];
        this.rowsToDelete = [];
        this.selectedKeywordGraphPidUri = res.newlyCreatedGraphUri;
        this.dataSource.data = [];
        this.store.dispatch([
          new FetchGraphKeywordUsage(res.newlyCreatedGraphUri),
          new FetchKeywordGraphs(),
          new FetchGraphTypeInstanceGraph(res.newlyCreatedGraphUri),
        ]);
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetGraphKeywordUsageData());
    this.masterSub.unsubscribe();
  }
}
