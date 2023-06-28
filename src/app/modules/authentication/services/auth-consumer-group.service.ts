import { Injectable } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { Select } from "@ngxs/store";
import { map } from "rxjs/operators";
import { Constants } from "src/app/shared/constants";
import {
  ResourceStateModel,
  ResourceState,
} from "src/app/state/resource.state";
import {
  UserInfoStateModel,
  UserInfoState,
} from "src/app/state/user-info.state";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthConsumerGroupService {
  @Select(ResourceState) resourceState$: Observable<ResourceStateModel>;
  @Select(UserInfoState) userInfoState$: Observable<UserInfoStateModel>;

  constructor(private authService: AuthService) {}

  IsAuthorizedToEdit(): Observable<boolean> {
    return combineLatest([
      this.resourceState$,
      this.userInfoState$,
      this.authService.hasAdminPrivilege$,
    ]).pipe(
      map(([resourceState, userInfoState, hasAdminPrivilege]) => {
        let authorized: boolean = false;
        if (resourceState.fetched && userInfoState.fetched) {
          authorized = hasAdminPrivilege;

          const consumerGroupProperty =
            resourceState.activeResource.properties[
              Constants.Metadata.HasConsumerGroup
            ];

          if (
            consumerGroupProperty &&
            consumerGroupProperty[0] === userInfoState.selectedConsumerGroupId
          ) {
            authorized = true;
          }

          const lifeCycleStatusProperty =
            resourceState.activeResource.properties[
              Constants.Metadata.LifeCycleStatus
            ];

          if (
            lifeCycleStatusProperty &&
            lifeCycleStatusProperty[0] ===
              Constants.Resource.LifeCycleStatus.MarkedDeletion
          ) {
            return false;
          }
        }
        return authorized;
      })
    );
  }
}
