import { Component, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { ActivatedRoute, Router } from "@angular/router";
import { LogService } from "../../../core/logging/log.service";
import { AuthConsumerGroupService } from "src/app/modules/authentication/services/auth-consumer-group.service";
import {
  ClearActiveResource,
  FetchResource,
} from "src/app/state/resource.state";
import { Observable } from "rxjs";

@Component({
  selector: "app-resource-edit",
  templateUrl: "./resource-edit.component.html",
  styleUrls: ["./resource-edit.component.css"],
})
export class ResourceEditComponent implements OnInit {
  constructor(
    private logger: LogService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private authConsumerGroupService: AuthConsumerGroupService
  ) {}

  get isAuthorizedToEdit$(): Observable<boolean> {
    return this.authConsumerGroupService.IsAuthorizedToEdit();
  }

  ngOnInit() {
    const resourcePidUri = this.route.snapshot.queryParamMap.get("pidUri");

    const resourceTypeUri = this.route.snapshot.queryParamMap.get("typeUri");

    this.logger.info("PID_RESOURCE_EDIT_OPENED", {
      resourcePidUri: resourcePidUri,
    });
    if (resourcePidUri == null) {
      this.router.navigate(["resource", "welcome"]);
    }

    this.store
      .dispatch([
        new ClearActiveResource(),
        new FetchResource(resourcePidUri, true, null, resourceTypeUri),
      ])
      .subscribe(() => {});
  }
}
