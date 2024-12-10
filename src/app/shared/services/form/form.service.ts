import { Injectable } from '@angular/core';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { FormExtension } from 'src/app/shared/extensions/form.extension';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private store: Store) {}

  createEntity(formProperties, metadata): Entity {
    const newResource = new Entity();
    newResource.properties = FormExtension.createEntityPropertyList(
      formProperties,
      metadata
    );

    return newResource;
  }

  get SelectedConsumerGroup() {
    const propValue = { key: '', value: '' };
    const userInfoState = this.store.selectSnapshot((state) => state).UserInfo;
    const consumerGroupState = this.store.selectSnapshot(
      (state) => state
    ).consumerGroups;

    if (
      consumerGroupState !== null &&
      consumerGroupState.consumerGroups !== null
    ) {
      const selectedConsumerGroup = consumerGroupState.consumerGroups.filter(
        (cg) => cg.id === userInfoState.selectedConsumerGroup
      )[0];
      propValue.key = selectedConsumerGroup.id;
      propValue.value = selectedConsumerGroup.name;
    }
    return propValue;
  }
}
