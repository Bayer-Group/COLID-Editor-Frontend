import { Component, OnInit, HostListener } from "@angular/core";
import { Store, Select } from "@ngxs/store";
import { Router, NavigationEnd } from "@angular/router";
import { Observable } from "rxjs";
import {
  UserInfoState,
  FetchUser,
  SetLastLoginEditor,
} from "./state/user-info.state";
import { ConsumerGroupResultDTO } from "./shared/models/consumerGroups/consumer-group-result-dto";
import { environment } from "../environments/environment";
import {
  SetSidebarMode,
  ToggleSidebar,
  SetSidebarOpened,
} from "./state/sidebar.state";
import { StatusState, FetchBuildInformation } from "./state/status.state";
import { StatusBuildInformationDto } from "./shared/models/status/status-build-information-dto";
import { Title } from "@angular/platform-browser";
import { EnsureBrowserSupportService } from "./modules/browser-support/services/ensure-browser-support.service";
import { ColidIconsService } from "./modules/colid-icons/services/colid-icons.service";
import { CustomMaterialIcon } from "./modules/colid-icons/models/custom-material-icon";
import { TaxonomyState, FetchTaxonomyList } from "./state/taxonomy.state";
import { Constants } from "./shared/constants";
import { TaxonomyResultDTO } from "./shared/models/taxonomy/taxonomy-result-dto";
import { AuthService } from "./modules/authentication/services/auth.service";
import { FetchNotifications } from "./modules/notification/notification.state";
import { of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "app-root",
  providers: [],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @Select(UserInfoState.getConsumerGroups) consumerGroups$: Observable<
    ConsumerGroupResultDTO[]
  >;
  @Select(StatusState.getBuildInformation)
  buildInformation$: Observable<StatusBuildInformationDto>;
  @Select(TaxonomyState.getTaxonomyList) taxonomyList$: Observable<
    Map<string, TaxonomyResultDTO[]>
  >;

  environmentLabel = environment.Label;
  isBrowserSupported = false;

  disableNavbar = false;

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }

  get currentName$(): Observable<string> {
    return this.authService.currentName$ || of("Unknown User");
  }

  get currentAccountIdentifier$(): Observable<string> {
    return this.authService.currentIdentity$.pipe(
      map((identity) => {
        if (identity) {
          return identity.accountIdentifier;
        } else {
          return "";
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
    this.titleService.setTitle("COLID " + this.environmentLabel);

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.disableNavbar = val.url === "/unavailable";
      }
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.setSidebarMode(event.target);
  }

  ngOnInit() {
    if (this.isBrowserSupported) {
      this.isLoggedIn$
        .pipe(
          switchMap((isAuth) => {
            return isAuth ? this.authService.currentIdentity$ : of(null);
          })
        )
        .pipe(
          switchMap((identity) => {
            if (identity) {
              console.log("Dispatching after identity found");
              return this.store.dispatch([
                new FetchUser(identity.accountIdentifier, identity.email),
                new FetchNotifications(identity.accountIdentifier),
                new FetchBuildInformation(),
                new FetchTaxonomyList(Constants.OWL.Class),
              ]);
            }
          })
        )
        .pipe(
          switchMap(() => {
            return this.store.dispatch(new SetLastLoginEditor());
          })
        )
        .subscribe();

      const taxonomyListSubscription = this.taxonomyList$.subscribe(
        (taxonomies) => {
          if (taxonomies.has(Constants.OWL.Class)) {
            var types = taxonomies
              .get(Constants.OWL.Class)
              .map((v) => new CustomMaterialIcon(v.id, v.id, v.name));
            this.appIconService.registerColidIcons(types);
            taxonomyListSubscription.unsubscribe();
          }
        }
      );
    }
  }

  setSidebarMode(window: Window) {
    if (window.innerWidth < 1000) {
      this.store.dispatch(new SetSidebarMode("over")).subscribe();
    } else {
      this.store
        .dispatch([new SetSidebarMode("side"), new SetSidebarOpened(true)])
        .subscribe();
    }
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar()).subscribe();
  }

  createSupportTicket() {
    window.open(environment.appSupportFeedBack.supportTicketLink);
  }
}
