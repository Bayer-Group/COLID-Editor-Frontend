import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import {
  MetaDataPropertyIdentifier,
  FieldTypeMapping
} from 'src/app/components/resource/resource-form/resource-form.constants';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { VersionProperty } from 'src/app/shared/models/resources/version-property';
import { Store } from '@ngxs/store';
import { FetchTaxonomyList } from 'src/app/state/taxonomy.state';
import { StringExtension } from 'src/app/shared/extensions/string.extension';
import {
  LinkingMapping,
  LinkType
} from 'src/app/shared/models/resources/linking-mapping';

@Component({
  selector: 'app-entity-display-item',
  templateUrl: './entity-display-item.component.html',
  styleUrls: ['./entity-display-item.component.scss']
})
export class EntityDisplayItemComponent implements OnInit {
  @Input() metadataProperty: MetaDataProperty;
  @Input() entityVersions: Array<any>;
  @Input() entityProperty: Array<any>;
  links: LinkingMapping[];
  @Input() mainDistributionEndpoint: boolean;
  @Input() expanded: boolean = false;

  @Output() versionClick = new EventEmitter<VersionProperty>();

  isLoading: boolean = false;
  constants = Constants;

  replaceSpecialCharacterFromText =
    StringExtension.ReplaceSpecialCharacterFromText;

  constructor(
    private store: Store,
    private resourceApiService: ResourceApiService
  ) {}

  ngOnInit() {
    if (this.entityProperty) {
      if (this.displayType === 'taxonomy') {
        const range =
          this.metadataProperty?.properties[Constants.Metadata.Range];
        this.fetchTaxonomy(range);
      } else if (this.isLinking) {
        this.fetchLinkedEntries();
      }
    }
  }

  private fetchTaxonomy(range: string) {
    this.isLoading = true;
    this.store.dispatch(new FetchTaxonomyList(range)).subscribe((_) => {
      this.isLoading = false;
    });
  }

  linkEntityExist(pidUri: string) {
    let linkElement = this.entityProperty.find((x) => x.pidUri == pidUri);
    return linkElement != null || linkElement != undefined;
  }
  getLinkedEntityLabel(pidUri: string) {
    let linkElement = this.entityProperty.find((x) => x.pidUri == pidUri);
    return linkElement.name;
  }
  getLinkedEntityResourceType(pidUri: string) {
    let linkElement = this.entityProperty.find((x) => x.pidUri == pidUri);
    return linkElement.resourceType;
  }
  getLinkedEntityDefinition(pidUri: string) {
    let linkElement = this.entityProperty.find((x) => x.pidUri == pidUri);
    return linkElement.definition;
  }
  getLinktype(link) {
    //var link :LinkingMapping = this.links.find(x=>x.pidUri==pidUri)
    var linktype = LinkType[link.linkType];
    return linktype;
  }

  private fetchLinkedEntries() {
    this.links = this.entityProperty;
    this.isLoading = true;

    const resourceSearch = new ResourceSearchDTO();
    resourceSearch.pidUris = this.entityProperty.map((x) => x.pidUri);
    resourceSearch.limit = this.entityProperty.length;
    resourceSearch.published = true;

    this.resourceApiService.getFilteredResources(resourceSearch).subscribe(
      (res) => {
        this.entityProperty = res.items;
        this.isLoading = false;
      },
      (_) => {
        this.entityProperty = this.entityProperty.map((pidUri) => {
          const resourceOverviewDTO = new ResourceOverviewDTO();
          resourceOverviewDTO.pidUri = pidUri;
          return resourceOverviewDTO;
        });
        this.isLoading = false;
      }
    );
  }

  get isLinking(): boolean {
    const group = this.metadataProperty?.properties[Constants.Metadata.Group];

    return group != null && group?.key === Constants.Resource.Groups.LinkTypes;
  }

  get isDistribution(): boolean {
    return this.metadataProperty?.nestedMetadata.length !== 0;
  }

  nestedMetdata(endpoint: Entity): Array<MetaDataProperty> {
    if (endpoint != null && endpoint?.properties) {
      const endpointType =
        endpoint.properties[Constants.Metadata.EntityType][0];
      const nestedMetdata = this.metadataProperty?.nestedMetadata.filter(
        (m) => m.key === endpointType
      )[0];
      return nestedMetdata.properties;
    }
    return [];
  }

  get displayType(): string {
    const group = this.metadataProperty?.properties[Constants.Metadata.Group];
    if (
      this.metadataProperty?.key === Constants.Metadata.HasPidUri ||
      this.metadataProperty?.key === MetaDataPropertyIdentifier.baseUri
    ) {
      return 'identifier';
    }

    if (this.metadataProperty?.key === Constants.Metadata.HasVersion) {
      return 'version';
    }

    if (this.isDistribution) {
      return 'distribution';
    }

    if (group != null && group?.key === Constants.Resource.Groups.LinkTypes) {
      return 'linking';
    }

    if (
      this.metadataProperty?.properties[Constants.Metadata.Range] &&
      this.metadataProperty?.properties[Constants.Metadata.NodeKind] ===
        Constants.Metadata.NodeType.IRI &&
      !(group != null && group?.key === Constants.Resource.Groups.LinkTypes)
    ) {
      return 'taxonomy';
    }

    if (this.checkEmail) {
      return 'email';
    }

    if (
      FieldTypeMapping[
        this.metadataProperty?.properties[Constants.Metadata.Datatype]
      ] === 'html'
    ) {
      return 'html';
    }

    if (
      FieldTypeMapping[
        this.metadataProperty?.properties[Constants.Metadata.Datatype]
      ] === 'datetime'
    ) {
      return 'datetime';
    }

    if (
      this.checkUrl &&
      this.metadataProperty?.key === Constants.Metadata.HasTargetUri
    ) {
      return this.checkProtocol ? 'url' : 'externalUrl';
    }

    return 'default';
  }

  versionClicked(event: VersionProperty) {
    this.versionClick.emit(event);
  }

  get checkUrl() {
    return (
      this.entityProperty &&
      this.entityProperty.some((value) => re_weburl.test(value))
    );
  }

  get checkEmail() {
    return (
      this.entityProperty &&
      this.entityProperty.some((value) => re_email.test(value))
    );
  }

  get checkProtocol() {
    return (
      this.entityProperty &&
      this.entityProperty.some((value) => re_protocol.test(value))
    );
  }

  getEndpointLabel(entity: Entity): string {
    const entityLabel =
      entity?.properties[Constants.Metadata.NetworkedResourceLabel];
    return StringExtension.ReplaceHtmlToText(entityLabel[0]);
  }
}

export const re_email = new RegExp(
  /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/
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
