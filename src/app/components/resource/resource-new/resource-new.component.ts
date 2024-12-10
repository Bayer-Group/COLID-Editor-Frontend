import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/core/logging/log.service';
import { FetchMetadata } from 'src/app/state/meta-data.state';
import {
  ClearActiveResource,
  FetchResource
} from 'src/app/state/resource.state';
import { Subscription } from 'rxjs';
import { ResourceCreationType } from 'src/app/shared/models/resources/resource-creation-type';

@Component({
  selector: 'app-resource-new',
  templateUrl: './resource-new.component.html',
  styleUrls: ['./resource-new.component.css']
})
export class ResourceNewComponent implements OnInit, OnDestroy {
  selectedResourceType: string;
  basedResourceUri: string;
  creationType: ResourceCreationType;
  useTemplate: boolean = false;

  routeSubscription: Subscription;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LogService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe((res) => {
      if (res.type == null || res.creationType == null) {
        this.router.navigate(['resource', 'hierarchy']);
      }

      this.creationType = res.creationType;
      this.basedResourceUri = res.based;
      this.selectedResourceType = res.type;
      this.useTemplate = res.useTemplate == 'true';

      if (this.creationType != ResourceCreationType.NEW && res.based != null) {
        this.store.dispatch([
          new ClearActiveResource(),
          new FetchResource(res.based, true, this.selectedResourceType)
        ]);
      } else {
        this.store.dispatch([
          new ClearActiveResource(),
          new FetchMetadata(this.selectedResourceType)
        ]);
      }

      this.logger.info('PID_RESOURCE_NEW_OPENED');
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
