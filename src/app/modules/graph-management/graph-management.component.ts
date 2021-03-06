import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GraphManagementApiService } from './services/graph-management-api.service';
import { GraphDto } from 'src/app/shared/models/graphs/graph-dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ColidMatSnackBarService } from '../colid-mat-snack-bar/colid-mat-snack-bar.service';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GraphUploadDialogComponent } from './components/graph-upload-dialog/graph-upload-dialog.component';

@Component({
  selector: 'app-graph-management',
  templateUrl: './graph-management.component.html',
  styleUrls: ['./graph-management.component.scss']
})
export class GraphManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'status', 'startTime', 'action'];

  loadingStatus: 'loaded' | 'deletion' | 'loading' | 'error';
  graphs: GraphDto[];
  dataSource: MatTableDataSource<GraphDto>;

  sortChangeSubscription: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private graphApiService: GraphManagementApiService, private snackBar: ColidMatSnackBarService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // If the user changes the sort order, reset back to the first page.
    this.sortChangeSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.loadGraphs();
  }

  ngOnDestroy() {
    this.sortChangeSubscription.unsubscribe();
  }

  loadGraphs() {
    this.loadingStatus = 'loading';
    this.graphApiService.getGraphs().subscribe(res => {
      this.dataSource.data = res;
      this.loadingStatus = 'loaded';
    }, error => {
      this.loadingStatus = 'error';
    })
  }

  deleteGraph(graph: GraphDto) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Delete Graph`,
        body: `Are you sure you want to delete the graph:<br><br> ${graph.name}`
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingStatus = 'loading';
        this.graphApiService.deleteGraph(graph.name).subscribe(res => {
          this.loadGraphs();
          this.snackBar.success("Graph", "Deleted successfully");
        }, error => {
          this.loadingStatus = 'error'
        })
      }
    });


  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  uploadGraph() {
    const dialogRef = this.dialog.open(GraphUploadDialogComponent, {
      minWidth: '40vw',
      minHeight: '30vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGraphs();
      }
    });
  }
}
