import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { EMPTY } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { UserInfoApiService } from "src/app/core/http/user-info.api.service";
import { HierarchicalData } from "src/app/shared/models/user/hiearchical-dto";

@Component({
  selector: "app-user-statistics-view",
  templateUrl: "./user-statistics-view.component.html",
  styleUrls: ["./user-statistics-view.component.css"],
})
export class UserStatisticsViewComponent implements OnInit, AfterViewInit {
  @ViewChild("chartContainer") chartContainer: ElementRef;

  chartData: HierarchicalData | null = null;
  loading = false;
  requestError = false;
  chartWidth: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserInfoApiService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getUserDepartmentsFlowView()
      .pipe(
        tap((data: HierarchicalData) => {
          this.chartData = data;
          this.loading = false;
        }),
        catchError((_) => {
          this.loading = false;
          this.requestError = true;
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.chartWidth = this.chartContainer.nativeElement.offsetWidth;
    this.cdr.detectChanges();
  }
}
