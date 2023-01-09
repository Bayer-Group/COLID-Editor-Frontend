import { Injectable } from '@angular/core';
import { ValidationResult } from '../../../shared/models/validation/validation-result';
import { ResourceRequestDTO } from 'src/app/shared/models/resources/requests/resource-request-dto';
import { Store } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants';
import { ConsumerGroupResultDTO } from 'src/app/shared/models/consumerGroups/consumer-group-result-dto';
import { FormExtension } from 'src/app/shared/extensions/form.extension';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { UserInfoStateModel } from 'src/app/state/user-info.state';
import { ValidationResultSeverity } from 'src/app/shared/models/validation/validation-result-severity';

export enum OPERATION {
  SAVE = 'save',
  SAVEANDPUBLISH = 'saveAndPublish',
  PUBLISH = 'publish',
  REVERT = 'revert'
}

@Injectable({
  providedIn: 'root'
})
export class ResourceFormService {

  constructor(private store: Store) { }

  createResourceDto(formProperties, metadata, mainDistribution): ResourceRequestDTO {
    let newResource = new ResourceRequestDTO();
    newResource.properties = FormExtension.createEntityPropertyList(formProperties, metadata);

    //newResource = this.transformAttachmentEntitiesToIdList(newResource);
    newResource = this.transformDistributionEndpointList(newResource, mainDistribution);

    return newResource;
  }

  transformAttachmentEntitiesToIdList(resource: ResourceRequestDTO): ResourceRequestDTO {
    let attachments = resource.properties[Constants.Metadata.HasAttachment];

    if(attachments != null && attachments.length > 0) {
      let uploadedAttachments = attachments.filter(attachment => !attachment.id.startsWith(Constants.Resource.Prefix));

      resource.properties[Constants.Metadata.HasAttachment] = uploadedAttachments;
    }

    return resource;
  }

  transformDistributionEndpointList(resource: ResourceRequestDTO, mainDistribution: string): ResourceRequestDTO {
    var distributionEndpoints = resource.properties[Constants.Metadata.Distribution];

    if (distributionEndpoints) {
      let indexToRemove = null;

      distributionEndpoints.forEach((item: Entity, index) => {
        if (item && item.id === mainDistribution) {
          resource.properties[Constants.Metadata.MainDistribution] = [item];
          indexToRemove = index;
        }
      });

      if (indexToRemove !== null) {
        distributionEndpoints.splice(indexToRemove, 1);
        if (distributionEndpoints) {
          resource.properties[Constants.Metadata.Distribution] = distributionEndpoints;
        } else {
          delete resource.properties[Constants.Metadata.Distribution];
        }
      }
    }

    return resource;
  }

  get SelectedConsumerGroup() {
    const userInfoState: UserInfoStateModel = this.store.selectSnapshot(state => state).UserInfo;

    if (userInfoState !== null && userInfoState.selectedConsumerGroupId !== null) {
      return userInfoState.selectedConsumerGroupId;
    }

    return null;
  }

  get SelectedConsumerGroupDefaultReviewCyclePolicy() {
    const userInfoState: UserInfoStateModel = this.store.selectSnapshot(state => state).UserInfo;

    if (userInfoState !== null) {
      return userInfoState.selectedConsumerGroupDefaultReviewCyclePolicy;
    }

    return null;
  }

  get DefaultPidUriTemplateKey() {
    const userInfoState: UserInfoStateModel = this.store.selectSnapshot(state => state).UserInfo;

    if (userInfoState && userInfoState.consumerGroups && userInfoState.selectedConsumerGroupId) {
      const selectedConsumerGroup: ConsumerGroupResultDTO = userInfoState.consumerGroups.filter(cg => cg.id === userInfoState.selectedConsumerGroupId)[0];
        if (selectedConsumerGroup) {
          const defaultPidUriTemplateKeys = selectedConsumerGroup.properties[Constants.ConsumerGroup.HasDefaultPidUriTemplate];
          if (defaultPidUriTemplateKeys) {
            return defaultPidUriTemplateKeys[0];
          }
        }
    }

    return null;
  }

  extractAvailablePidUriTemplates(pidUriTemplates: PidUriTemplateResultDTO[], consumerGroups: ConsumerGroupResultDTO[], selectedConsumerGroupId: string): Array<PidUriTemplateResultDTO> {
    if (consumerGroups == null || pidUriTemplates == null) {
      return new Array<PidUriTemplateResultDTO>();
    }
    const selectedConsumerGroup: ConsumerGroupResultDTO = consumerGroups.filter(cg => cg.id === selectedConsumerGroupId)[0];

    if (selectedConsumerGroup == null) {
      return new Array<PidUriTemplateResultDTO>();
    }

    const availablePidUriTemplateKeys = selectedConsumerGroup.properties[Constants.ConsumerGroup.HasPidUriTemplate];

    if (!availablePidUriTemplateKeys) {
      return new Array<PidUriTemplateResultDTO>();
    }

    const pidUriTemplateNames: Array<PidUriTemplateResultDTO> = new Array<PidUriTemplateResultDTO>();

    for (const pidUriTemplateKey of availablePidUriTemplateKeys) {

      const pidUriTemplate = pidUriTemplates.filter(put => (put.id === pidUriTemplateKey))[0];

      if (pidUriTemplate != null) {
        pidUriTemplateNames.push(pidUriTemplate);
      }
    }

    return pidUriTemplateNames;
  }

  createValidationMessage(success: boolean, validationResult: ValidationResult, operation: OPERATION): any {
    const isSaveAndPublishedOperation = operation === OPERATION.SAVEANDPUBLISH;
    const operationAsString: string[] = new Array<string>();
    operationAsString[OPERATION.SAVE] = 'saved';
    operationAsString[OPERATION.SAVEANDPUBLISH] = success ? 'saved successfully, but could not be published' : 'saved and published';
    operationAsString[OPERATION.PUBLISH] = 'saved and published';



    const operationSubString = success
      ? 'has been ' + operationAsString[operation] + (isSaveAndPublishedOperation ? '' : ' successfully')
      : 'could not be ' + operationAsString[operation];


    if (operation === OPERATION.SAVEANDPUBLISH) {
      return {
        level: 'error',
        titel: 'Resource',
        message: 'Resource ' + operationSubString + ', because the validation failed.'
      };
    } else if (validationResult.conforms || validationResult.severity === ValidationResultSeverity.INFO) {
      return {
        level: 'success',
        titel: 'Resource',
        message: 'Resource ' + operationSubString + '.'
      };
    } else if (validationResult.severity === ValidationResultSeverity.WARNING) {
      return {
        level: isSaveAndPublishedOperation ? 'error' : 'warn',
        titel: 'Resource',
        message: 'Resource ' + operationSubString + ' but the validation failed.'
      };
    } else {
      return {
        level: 'error',
        titel: 'Resource',
        message: 'Resource ' + operationSubString + ' because the validation failed.'
      };
    }
  }
}
