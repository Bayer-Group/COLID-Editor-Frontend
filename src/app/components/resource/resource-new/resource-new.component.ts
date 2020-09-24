import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/core/logging/log.service';
import { FetchMetadata } from 'src/app/state/meta-data.state';
import { ClearActiveResource, FetchResource } from 'src/app/state/resource.state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resource-new',
  templateUrl: './resource-new.component.html',
  styleUrls: ['./resource-new.component.css']
})
export class ResourceNewComponent implements OnInit, OnDestroy {

  selectedResourceType: string;
  previousVersion: string;
  routeSubscription: Subscription

  constructor(private store: Store, private router: Router, private route: ActivatedRoute,
    private logger: LogService) { }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(res => {
      if (res.type == null) {
        this.router.navigate(['resource', 'hierarchy']);
      }

      if (res.previousVersion != null) {
        this.store.dispatch([new ClearActiveResource(), new FetchResource(res.previousVersion, true)]).subscribe(() => { });
      } else {
        this.store.dispatch([new ClearActiveResource(), new FetchMetadata(res.type)]).subscribe(() => { });
      }

      this.logger.info('PID_RESOURCE_NEW_OPENED');

      this.selectedResourceType = res.type;
      this.previousVersion = res.previousVersion;
    });
  }

  ngOnDestroy() {
      this.routeSubscription.unsubscribe();
  }
}
