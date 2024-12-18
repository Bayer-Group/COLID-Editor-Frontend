import { Selector, State, Action, StateContext } from '@ngxs/store';
import { ConsumerGroupApiService } from '../core/http/consumer-group.api.service';
import { MetaDataApiService } from '../core/http/meta-data.api.service';
import { ConsumerGroupResultDTO } from '../shared/models/consumerGroups/consumer-group-result-dto';
import { MetaDataProperty } from '../shared/models/metadata/meta-data-property';
import { tap } from 'rxjs/operators';
import { Constants } from '../shared/constants';
import {
  PidUriTemplateState,
  PidUriTemplateStateModel
} from './pid-uri-template.state';
import { UserInfoState, UserInfoStateModel } from './user-info.state';
import { Injectable } from '@angular/core';

export class FetchConsumerGroups {
  static readonly type = '[ConsumerGroup] Fetch consumerGroups';
  constructor() {}
}

export class FetchConsumerGroupDetails {
  static readonly type = '[ConsumerGroup] Fetch consumerGroup';
  constructor(public payload: string) {}
}

export class FetchConsumerGroupMetadata {
  static readonly type = '[ConsumerGroup] Fetch consumerGroupMetadata';
  constructor() {}
}

export class SetConsumerGroup {
  static readonly type = '[ConsumerGroup] Set consumerGroup';
  constructor(public payload: ConsumerGroupResultDTO) {}
}

export class ClearConsumerGroup {
  static readonly type = '[ConsumerGroup] Clear consumerGroup';
}

export class ConsumerGroupStateModel {
  consumerGroups: ConsumerGroupResultDTO[];
  consumerGroup: ConsumerGroupResultDTO;
  metadata: MetaDataProperty[];
}

@State<ConsumerGroupStateModel>({
  name: 'consumerGroups',
  defaults: {
    consumerGroups: null,
    consumerGroup: null,
    metadata: null
  }
})
@Injectable()
export class ConsumerGroupState {
  constructor(
    private consumerGroupApiService: ConsumerGroupApiService,
    private metadataService: MetaDataApiService
  ) {}

  @Selector()
  public static getConsumerGroups(state: ConsumerGroupStateModel) {
    return state.consumerGroups;
  }

  @Selector()
  public static getConsumerGroup(state: ConsumerGroupStateModel) {
    return state.consumerGroup;
  }

  @Selector()
  public static getConsumerGroupMetadata(state: ConsumerGroupStateModel) {
    return state.metadata;
  }

  @Action(FetchConsumerGroups)
  fetchConsumerGroups(
    { patchState }: StateContext<ConsumerGroupStateModel>,
    {}: FetchConsumerGroups
  ) {
    return this.consumerGroupApiService.getAllEntities().pipe(
      tap((res) => {
        patchState({
          consumerGroups: res
        });
      })
    );
  }

  @Action(FetchConsumerGroupMetadata)
  fetchConsumerGroupMetadata(
    { getState, patchState }: StateContext<ConsumerGroupStateModel>,
    {}: FetchConsumerGroupMetadata
  ) {
    if (getState().metadata != null) {
      return;
    }

    return this.metadataService
      .getMetaData(Constants.ResourceTypes.ConsumerGroup)
      .pipe(
        tap((res) => {
          patchState({
            metadata: res
          });
        })
      );
  }

  @Action(FetchConsumerGroupDetails)
  fetchConsumerGroupDetails(
    { patchState }: StateContext<ConsumerGroupStateModel>,
    { payload }: FetchConsumerGroupDetails
  ) {
    return this.consumerGroupApiService.getEntityById(payload).pipe(
      tap((res) => {
        patchState({
          consumerGroup: res
        });
      })
    );
  }

  @Action(SetConsumerGroup)
  setConsumerGroup(
    { patchState }: StateContext<ConsumerGroupStateModel>,
    action: SetConsumerGroup
  ) {
    patchState({
      consumerGroup: action.payload
    });
  }

  @Action(ClearConsumerGroup)
  clearConsumerGroup(
    { patchState }: StateContext<ConsumerGroupStateModel>,
    {}: ClearConsumerGroup
  ) {
    patchState({
      consumerGroup: null
    });
  }
}

export class ConsumerGroupPidUriTemplateMetaSelector {
  @Selector([ConsumerGroupState, PidUriTemplateState, UserInfoState])
  public static consumerGroupPidUriTemplate(
    consumerGroupState: ConsumerGroupStateModel,
    pidUriTemplateState: PidUriTemplateStateModel,
    userInfoState: UserInfoStateModel
  ) {
    return {
      PidUriTemplates: pidUriTemplateState.pidUriTemplates,
      ConsumerGroups: userInfoState.consumerGroups,
      SelectedConsumerGroup: userInfoState.selectedConsumerGroupId
    };
  }
}
