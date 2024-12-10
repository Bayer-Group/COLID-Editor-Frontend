import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  UserInfoState,
  FetchUser,
  SetLastLoginEditor,
  FetchConsumerGroupsByUser
} from './state/user-info.state';
import { ConsumerGroupResultDTO } from './shared/models/consumerGroups/consumer-group-result-dto';
import { environment } from '../environments/environment';
import {
  SetSidebarMode,
  ToggleSidebar,
  SetSidebarOpened
} from './state/sidebar.state';
import { StatusState, FetchBuildInformation } from './state/status.state';
import { StatusBuildInformationDto } from './shared/models/status/status-build-information-dto';
import { Title } from '@angular/platform-browser';
import { EnsureBrowserSupportService } from './modules/browser-support/services/ensure-browser-support.service';
import { ColidIconsService } from './modules/colid-icons/services/colid-icons.service';
import { CustomMaterialIcon } from './modules/colid-icons/models/custom-material-icon';
import { TaxonomyState, FetchTaxonomyList } from './state/taxonomy.state';
import { Constants } from './shared/constants';
import { TaxonomyResultDTO } from './shared/models/taxonomy/taxonomy-result-dto';
import { AuthService } from './modules/authentication/services/auth.service';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FetchEntityLabelMapping } from './state/entity-label-mapping.state';

@Component({
  selector: 'app-root',
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(UserInfoState.getConsumerGroups) consumerGroups$: Observable<
    ConsumerGroupResultDTO[]
  >;
  @Select(StatusState.getBuildInformation)
  buildInformation$: Observable<StatusBuildInformationDto>;
  @Select(TaxonomyState.getTaxonomyList) taxonomyList$: Observable<
    Map<string, TaxonomyResultDTO[]>
  >;

  masterSub: Subscription = new Subscription();
  environmentLabel = environment.Label;
  isBrowserSupported = false;

  disableNavbar = false;

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }

  get currentName$(): Observable<string> {
    return this.authService.currentName$ || of('Unknown User');
  }

  get currentAccountIdentifier$(): Observable<string> {
    return this.authService.currentIdentity$.pipe(
      map((identity) => {
        if (identity) {
          return identity.accountIdentifier;
        } else {
          return '';
        }
      })
    );
  }

  get hasAdminPrivilege$(): Observable<boolean> {
    return this.authService.hasAdminPrivilege$;
  }

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.authService.hasCreatePrivilege$;
  }

  constructor(
    private browserSupport: EnsureBrowserSupportService,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private titleService: Title,
    private appIconService: ColidIconsService
  ) {
    this.isBrowserSupported = browserSupport.isSupported();
    this.titleService.setTitle('COLID ' + this.environmentLabel);

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.disableNavbar = val.url === '/unavailable';
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSidebarMode(event.target);
  }

  ngOnInit() {
    if (this.isBrowserSupported) {
      this.masterSub.add(
        this.isLoggedIn$
          .pipe(
            switchMap((isAuth) => {
              console.log('isAuth', isAuth);
              return isAuth ? this.authService.currentIdentity$ : of(null);
            })
          )
          .pipe(
            switchMap((identity) => {
              console.log('identity', identity);
              if (identity) {
                return this.store.dispatch([
                  new FetchUser(identity.accountIdentifier, identity.email),
                  new FetchBuildInformation(),
                  new FetchTaxonomyList(Constants.OWL.Class),
                  new FetchEntityLabelMapping(),
                  new SetLastLoginEditor(),
                  new FetchConsumerGroupsByUser()
                ]);
              } else {
                return of(null);
              }
            })
          )
          .subscribe()
      );

      this.masterSub.add(
        this.taxonomyList$.subscribe((taxonomies) => {
          if (taxonomies.has(Constants.OWL.Class)) {
            var types = taxonomies
              .get(Constants.OWL.Class)
              .map((v) => new CustomMaterialIcon(v.id, v.id, v.name));
            this.appIconService.registerColidIcons(types);
          }
        })
      );
    }
  }

  setSidebarMode(window: Window) {
    if (window.innerWidth < 1000) {
      this.store.dispatch(new SetSidebarMode('over')).subscribe();
    } else {
      this.store
        .dispatch([new SetSidebarMode('side'), new SetSidebarOpened(true)])
        .subscribe();
    }
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar()).subscribe();
  }

  createSupportTicket() {
    window.open(environment.appSupportFeedBack.supportTicketLink);
  }

  ngOnDestroy(): void {
    this.masterSub.unsubscribe();
    this.authService.cleanup();
  }
}
