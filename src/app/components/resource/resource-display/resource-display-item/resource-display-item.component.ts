import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import {
  FieldTypeMapping,
  MetaDataPropertyIdentifier
} from '../../resource-form/resource-form.constants';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Resource } from '../../../../shared/models/resources/resource';
import { MetaDataPropertyGroup } from 'src/app/shared/models/metadata/meta-data-property-group';

@Component({
  selector: 'app-resource-display-item',
  templateUrl: './resource-display-item.component.html',
  styleUrls: ['./resource-display-item.component.css']
})
export class ResourceDisplayItemComponent implements OnInit {
  constants = Constants;
  pidUriConstant = Constants.Metadata.HasPidUri;
  displayType: string;
  @Input() resource: Resource;
  @Input() metadata: MetaDataProperty;
  @Input() disableLabel: boolean;
  @Input() previousLinking: boolean;

  internalValue: any;

  ngOnInit() {
    this.internalValue = this.getResourcePropertyValue();
    const group: MetaDataPropertyGroup =
      this.metadata?.properties[Constants.Metadata.Group];
    const metadataKey = this.metadata?.properties[this.pidUriConstant];

    if (
      metadataKey === this.pidUriConstant ||
      metadataKey === MetaDataPropertyIdentifier.baseUri
    ) {
      this.displayType = 'identifier';
      return;
    }

    if (this.metadata?.nestedMetadata?.length !== 0) {
      this.displayType = 'distribution';
      this.InternalValueToArray();
      return;
    }

    if (group != null && group.key === Constants.Resource.Groups.LinkTypes) {
      this.displayType = 'linking';
      return;
    }

    if (
      this.metadata?.properties[Constants.Metadata.Range] &&
      this.metadata?.properties[Constants.Metadata.NodeKind] ===
        Constants.Metadata.NodeType.IRI &&
      !(group != null && group.key === Constants.Resource.Groups.LinkTypes)
    ) {
      this.displayType = 'list';
      this.InternalValueToArray();
      return;
    }

    if (this.checkEmail) {
      this.displayType = 'email';
      return;
    }

    if (
      FieldTypeMapping[
        this.metadata?.properties[Constants.Metadata.Datatype]
      ] === 'html'
    ) {
      this.displayType = 'html';
      return;
    }

    if (
      FieldTypeMapping[
        this.metadata?.properties[Constants.Metadata.Datatype]
      ] === 'datetime'
    ) {
      this.displayType = 'datetime';
      return;
    }

    if (this.checkUrl && metadataKey === Constants.Metadata.HasTargetUri) {
      if (this.checkProtocol) {
        this.displayType = 'url';
      } else {
        this.displayType = 'externalUrl';
      }
      return;
    }
  }

  InternalValueToArray() {
    if (this.internalValue != null) {
      this.internalValue = [this.internalValue];
    }
  }

  getResourcePropertyValue() {
    if (this.resource?.properties) {
      const value =
        this.resource?.properties[
          this.metadata?.properties[this.pidUriConstant]
        ];

      if (value == null) {
        return [];
      }

      return Array.isArray(value) ? value : [value];
    }
  }

  get checkUrl() {
    return re_weburl.test(this.internalValue);
  }

  get checkEmail() {
    return re_email.test(this.internalValue);
  }

  get checkProtocol() {
    return re_protocol.test(this.internalValue);
  }
}

export const re_email = new RegExp(
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
);

export const re_protocol = new RegExp(
  '^' +
    // protocol identifier
    '(?:(?:https?|http?|ftp)://)'
);

export const re_weburl = new RegExp(
  '^' +
    // protocol identifier
    '(?:(?:https?|http?|ftp)://)*' +
    // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion
    // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
    // TLD may end with dot
    '\\.?' +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(?:[/?#]\\S*)?' +
    '$',
  'i'
);
