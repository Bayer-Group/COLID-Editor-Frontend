import { Component, OnInit } from '@angular/core';
import { Store} from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../../../core/logging/log.service';
import { AuthConsumerGroupService } from 'src/app/modules/authentication/services/auth-consumer-group.service';
import { ClearActiveResource, FetchResource } from 'src/app/state/resource.state';

@Component({
  selector: 'app-resource-edit',
  templateUrl: './resource-edit.component.html',
  styleUrls: ['./resource-edit.component.css']
})
export class ResourceEditComponent implements OnInit {
  validating = true;
  authorized = false;

  constructor(
    private logger: LogService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private authConsumerGroupService: AuthConsumerGroupService) { }

  ngOnInit() {
    const resourcePidUri = this.route.snapshot.queryParamMap.get('pidUri');
    this.logger.info('PID_RESOURCE_EDIT_OPENED', { 'resourcePidUri': resourcePidUri });

    if (resourcePidUri == null) {
      this.router.navigate(['resource', 'welcome']);
    }
    this.store.dispatch([new ClearActiveResource(), new FetchResource(resourcePidUri, true)]).subscribe(() => { });

    this.authConsumerGroupService.IsAuthorizedForEdit().subscribe(isAuthorized => {
      this.authorized = isAuthorized;
      if (isAuthorized !== null) {
        this.validating = false;
      }
    });
  }
}
