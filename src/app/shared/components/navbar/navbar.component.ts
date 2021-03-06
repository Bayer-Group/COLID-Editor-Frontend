import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { StatusState } from 'src/app/state/status.state';
import { UserInfoState, FetchConsumerGroupsByUser, SelectConsumerGroup, SetDefaultConsumerGroupForUser, SetSearchFilterEditor } from 'src/app/state/user-info.state';
import { ToggleSidebar } from 'src/app/state/sidebar.state';
import { ConsumerGroupResultDTO } from 'src/app/shared/models/consumerGroups/consumer-group-result-dto';
import { BuildInformationDto } from 'src/app/shared/models/status/build-information-dto';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { CreateResource } from 'src/app/state/resource.state';
import { DefaultConsumerGroupDto } from '../../models/user/default-consumer-group-dto';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { NotificationState } from 'src/app/modules/notification/notification.state';
import { MessageDto } from '../../models/user/message-dto';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Select(UserInfoState.getConsumerGroups) consumerGroups$: Observable<ConsumerGroupResultDTO[]>;
  @Select(UserInfoState.getSelectedConsumerGroupId) selectedConsumerGroupId$: Observable<string>;
  @Select(UserInfoState.getDefaultConsumerGroup) defaultConsumerGroup$: Observable<DefaultConsumerGroupDto>;
  @Select(StatusState.getBuildInformation) buildInformation$: Observable<BuildInformationDto>;
  @Select(NotificationState.getNotifications) notifications$: Observable<MessageDto[]>;

  @Output() toggleNotification: EventEmitter<any> = new EventEmitter();

  consumerGroups: ConsumerGroupResultDTO[];
  defaultConsumerGroup: DefaultConsumerGroupDto;
  selectedConsumerGroup: ConsumerGroupResultDTO;
  selectedConsumerGroupId: string;
  environmentLabel = environment.Label;
  newNotifications: number = 0;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private snackbar: ColidMatSnackBarService,
    private router: Router,
    private store: Store) {
    this.titleService.setTitle('COLID Editor ' + this.environmentLabel)
  }

  ngOnInit() {
    this.notifications$.subscribe(n => {
      this.newNotifications = n != null ? n.filter(t => t.readOn == null).length : 0;
    })
    this.store.dispatch(new FetchConsumerGroupsByUser).subscribe();

    this.consumerGroups$.subscribe(consumerGroups => {
      this.consumerGroups = consumerGroups;

      if (this.selectedConsumerGroupId != null) {
        this.selectedConsumerGroup = this.consumerGroups.find(cg => cg.id === this.selectedConsumerGroupId);
      }

      if (consumerGroups != null && consumerGroups.length > 0 && this.defaultConsumerGroup == null) {
        this.defaultConsumerGroup = new DefaultConsumerGroupDto(consumerGroups[0].id);
      }
    });

    this.selectedConsumerGroupId$.subscribe(selectedConsumerGroupId => {
      this.selectedConsumerGroupId = selectedConsumerGroupId;

      if (this.consumerGroups != null) {
        this.selectedConsumerGroup = this.consumerGroups.find(cg => cg.id === selectedConsumerGroupId);
      }
    });

    this.defaultConsumerGroup$.subscribe(defaultConsumerGroup => {
      if (defaultConsumerGroup != null) {
        this.defaultConsumerGroup = defaultConsumerGroup;
      }
    });

  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  get hasCreatePrivilege() {
    return this.authService.hasCreatePrivilege;
  }

  get isAuthorized() {
    return this.authService.isAuthorized;
  }

  get isLoadingUser() {
    return this.authService.isLoadingUser;
  }

  get currentName() {
    return this.authService.currentName || 'Unknown User';
  }

  get hasAdminPrivilege() {
    return this.authService.hasAdminPrivilege;
  }

  registerNewResource() {
    this.store.dispatch(new CreateResource()).subscribe(() =>
      this.router.navigate(['resource', 'hierarchy']));
  }

  goToDataMarketplace() {
    const url = environment.dmpUrl;
    window.open(url, '_blank');
  }

  selectConsumerGroup(event: any) {
    this.selectedConsumerGroup = event.value;
    this.store.dispatch(new SelectConsumerGroup(event.value.id)).subscribe();
  }

  setDefaultConsumerGroup() {
    this.store.dispatch(new SetDefaultConsumerGroupForUser(this.selectedConsumerGroup.id)).subscribe(() => {
      this.snackbar.success('Default Consumer Group', 'The default consumer group has been set successfully.');
    }, error => {
      if (error.status === 404) {
        this.snackbar.error('Default Consumer Group', error.error.message);
      }
    });
  }

  setDefaultSidebarFilters() {
    this.store.dispatch(new SetSearchFilterEditor()).subscribe(() => {
      this.snackbar.success('Default Search Filters', 'The default search filters have been set successfully.');
    }, error => {
      if (error.status === 404) {
        this.snackbar.error('Default Search Filters', error.error.message);
      }
    });
  }

  createSupportTicket() {
    window.open(environment.appSupportFeedBack.supportTicketLink);
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar()).subscribe();
  }
}
