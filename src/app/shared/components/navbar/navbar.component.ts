import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import {
  UserInfoState,
  SelectConsumerGroup,
  SetDefaultConsumerGroupForUser
} from 'src/app/state/user-info.state';
import { ToggleSidebar } from 'src/app/state/sidebar.state';
import { ConsumerGroupResultDTO } from 'src/app/shared/models/consumerGroups/consumer-group-result-dto';
import { Observable, combineLatest, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { Constants } from '../../constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Select(UserInfoState.getConsumerGroups) consumerGroups$: Observable<
    ConsumerGroupResultDTO[]
  >;
  @Select(UserInfoState.getSelectedConsumerGroupId)
  selectedConsumerGroupId$: Observable<string>;

  consumerGroups: ConsumerGroupResultDTO[];
  selectedConsumerGroup: ConsumerGroupResultDTO;
  selectedConsumerGroupId: string;
  environmentLabel = environment.Label;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private snackbar: ColidMatSnackBarService,
    private router: Router,
    private store: Store
  ) {
    this.titleService.setTitle('COLID Editor ' + this.environmentLabel);
  }

  ngOnInit() {
    combineLatest([
      this.consumerGroups$,
      this.selectedConsumerGroupId$
    ]).subscribe(([consumerGroups, selectedConsumerGroupId]) => {
      this.consumerGroups = consumerGroups;
      if (selectedConsumerGroupId != null && consumerGroups != null) {
        console.log('cg groups', consumerGroups);
        console.log('cg id', selectedConsumerGroupId);
        this.selectedConsumerGroupId = selectedConsumerGroupId;
        this.selectedConsumerGroup = consumerGroups.find(
          (cg) => cg.id === this.selectedConsumerGroupId
        );
        if (this.selectedConsumerGroup === undefined) {
          this.selectedConsumerGroup = consumerGroups[0];
        }
      }
    });
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.authService.hasCreatePrivilege$;
  }

  get isAuthorized(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }

  get isLoadingUser() {
    return this.authService.isLoadingUser;
  }

  get currentName$(): Observable<string> {
    return this.authService.currentName$ || of('Unknown User');
  }

  get hasAdminPrivilege$(): Observable<boolean> {
    return this.authService.hasAdminPrivilege$;
  }

  registerNewResource() {
    //this.store.dispatch(new CreateResource()).subscribe(() =>
    this.router.navigate(['resource', 'hierarchy']); //);
  }

  selectConsumerGroup(event: any) {
    this.selectedConsumerGroup = event.value;
    const selectedConsumerGroupDefaultReviewCyclePolicy = this
      .selectedConsumerGroup.properties[
      Constants.ConsumerGroup.HasDefaultReviewCyclePolicy
    ]
      ? this.selectedConsumerGroup.properties[
          Constants.ConsumerGroup.HasDefaultReviewCyclePolicy
        ][0]
      : null;
    this.store
      .dispatch(
        new SelectConsumerGroup(
          event.value.id,
          selectedConsumerGroupDefaultReviewCyclePolicy
        )
      )
      .subscribe();
  }

  setDefaultConsumerGroup() {
    this.store
      .dispatch(
        new SetDefaultConsumerGroupForUser(this.selectedConsumerGroup.id)
      )
      .subscribe(
        () => {
          this.snackbar.success(
            'Default Consumer Group',
            'The default consumer group has been set successfully.'
          );
        },
        (error) => {
          if (error.status === 404) {
            this.snackbar.error('Default Consumer Group', error.error.message);
          }
        }
      );
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar()).subscribe();
  }
}
