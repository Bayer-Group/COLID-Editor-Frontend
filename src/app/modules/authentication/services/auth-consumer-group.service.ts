import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Select } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants';
import { ResourceStateModel, ResourceState } from 'src/app/state/resource.state';
import { UserInfoStateModel, UserInfoState } from 'src/app/state/user-info.state';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthConsumerGroupService {
    @Select(ResourceState) resourceState$: Observable<ResourceStateModel>;
    @Select(UserInfoState) userInfoState$: Observable<UserInfoStateModel>;

    constructor(private authService: AuthService) { }

    IsAuthorizedForEdit(): Observable<boolean> {
        return combineLatest(this.resourceState$, this.userInfoState$).pipe(map(([resourceState, userInfoState]) => {
            let authorized: boolean = null;
            if (resourceState.fetched === true && userInfoState.fetched === true) {
              authorized = this.authService.hasAdminPrivilege;

              const consumerGroupProperty = resourceState.activeResource.properties[Constants.Metadata.HasConsumerGroup];

                if (consumerGroupProperty && consumerGroupProperty[0] === userInfoState.selectedConsumerGroupId) {
                    authorized = true;
                }

                const lifeCycleStatusProperty = resourceState.activeResource.properties[Constants.Metadata.LifeCycleStatus];

                if (lifeCycleStatusProperty && lifeCycleStatusProperty[0] === Constants.Resource.LifeCycleStatus.MarkedDeletion) {
                    return false;
                }
            }
            return authorized;
        }));
    }
}
