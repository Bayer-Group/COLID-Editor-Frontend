import { environment } from 'src/environments/environment';

export const IDENT_PROV = "IdentityProvider";

export const Constants = {
  ResourceTypes: {
    ConsumerGroup: 'https://pid.bayer.com/kos/19050#ConsumerGroup',
    MetadataGraphConfiguration: 'https://pid.bayer.com/kos/19050/367403',
    PidUriTemplate: 'https://pid.bayer.com/kos/19050#PidUriTemplate',
    ExtendedUriTemplate: 'https://pid.bayer.com/kos/19050#ExtendedUriTemplate',
    Keyword: 'https://pid.bayer.com/kos/19050/Keyword'
  },
  Identifier: {
    Type: 'http://pid.bayer.com/kos/19014/PermanentIdentifier'
  },
  ControlledVocabulary: {
    HasInformationClassification: {
      Secret: 'https://pid.bayer.com/kos/19050/Secret'
    }
  },
  OntologyTypes: {
    Ontology: 'http://pid.bayer.com/kos/19014/Ontology'
  },
  Metadata: {
    Author: 'https://pid.bayer.com/kos/19050/author',
    HasInformationClassification: 'https://pid.bayer.com/kos/19050/hasInformationClassification',
    Type: {
      Decimal: 'http://www.w3.org/2001/XMLSchema#decimal',
      Boolean: 'http://www.w3.org/2001/XMLSchema#boolean',
      DateTime: 'http://www.w3.org/2001/XMLSchema#dateTime',
      String: 'http://www.w3.org/2001/XMLSchema#string',
      HTML: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML'
    },
    NodeType: {
      IRI: 'http://www.w3.org/ns/shacl#IRI',
      Literal: 'http://www.w3.org/ns/shacl#IRI'
    },
    NodeKind: 'http://www.w3.org/ns/shacl#nodeKind',
    EntityType: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    HasBaseUri: 'https://pid.bayer.com/kos/19050/hasBaseURI',
    DateCreated: 'https://pid.bayer.com/kos/19050/dateCreated',
    LastChangeDateTime: 'https://pid.bayer.com/kos/19050/lastChangeDateTime',
    HasConsumerGroup: 'https://pid.bayer.com/kos/19050#hasConsumerGroup',
    HasLastChangeUser: 'https://pid.bayer.com/kos/19050/lastChangeUser',
    HasVersion: 'https://pid.bayer.com/kos/19050/hasVersion',
    HasPidUri: 'http://pid.bayer.com/kos/19014/hasPID',
    HasTargetUri: 'http://pid.bayer.com/kos/19014/hasNetworkAddress',
    PidUriTemplateIdType: 'https://pid.bayer.com/kos/19050#hasPidUriTemplateIdType',
    PidUriTemplateSuffix: 'https://pid.bayer.com/kos/19050#hasPidUriTemplateSuffix',
    Range: 'http://www.w3.org/2000/01/rdf-schema#range',
    MinCount: 'http://www.w3.org/ns/shacl#minCount',
    Name: 'http://www.w3.org/ns/shacl#name',
    ControlledVocabulary: 'https://pid.bayer.com/kos/19050#ControlledVocabulary',
    Group: 'http://www.w3.org/ns/shacl#group',
    Order: 'http://www.w3.org/ns/shacl#order',
    MaxCount: 'http://www.w3.org/ns/shacl#maxCount',
    Datatype: 'http://www.w3.org/ns/shacl#datatype',
    Comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
    LifeCycleStatus: 'https://pid.bayer.com/kos/19050/hasEntryLifecycleStatus',
    ColidEntryDraft: 'https://pid.bayer.com/kos/19050/hasDraft',
    HasUriTemplate: 'https://pid.bayer.com/kos/19050/hasUriTemplate',
    HasResourceDefinition: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
    HasLabel: 'https://pid.bayer.com/kos/19050/hasLabel',
    RdfsLabel: 'http://www.w3.org/2000/01/rdf-schema#label',
    Distribution: 'https://pid.bayer.com/kos/19050/distribution',
    PointAt: 'https://pid.bayer.com/kos/19050/baseURIPointsAt',
    MainDistribution: 'https://pid.bayer.com/kos/19050/mainDistribution',
    Keywords: 'https://pid.bayer.com/kos/19050/47119343',
    Pattern: 'http://www.w3.org/ns/shacl#pattern',
    HasLaterVersion: 'https://pid.bayer.com/kos/19050/hasLaterVersion',
    MetadataReleaseConfig: 'https://pid.bayer.com/kos/19050/646465',
    NetworkedResourceLabel: 'https://pid.bayer.com/kos/19050/hasNetworkedResourceLabel'
  },
  Display: {
    Header: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
    SubHeader: 'http://pid.bayer.com/kos/19014/hasPID'
  },
  Person: {
    Type: 'http://pid.bayer.com/kos/19014/Person'
  },
  Resource: {
    // For Resource Id
    Prefix: 'https://pid.bayer.com/kos/19050#',
    LifeCycleStatus: {
      Draft: 'https://pid.bayer.com/kos/19050/draft',
      Published: 'https://pid.bayer.com/kos/19050/published',
      Historic: 'https://pid.bayer.com/kos/19050/historic',
      MarkedDeletion: 'https://pid.bayer.com/kos/19050/markedForDeletion'
    },
    Groups: {
      InvisibleTechnicalInformation: 'http://pid.bayer.com/kos/19050/InvisibleTechnicalInformation',
      TechnicalInformation: 'https://pid.bayer.com/kos/19050/TechnicalInformation',
      LinkTypes: 'http://pid.bayer.com/kos/19050/LinkTypes',
      DistributionEndpoints: 'http://pid.bayer.com/kos/19050/DistributionEndpoints'
    }
  },
  Shacl: {
    Range: 'http://www.w3.org/2000/01/rdf-schema#range',
    Severity: {
      Info: 'http://www.w3.org/ns/shacl#Info',
      Warning: 'http://www.w3.org/ns/shacl#Warning',
      Violation: 'http://www.w3.org/ns/shacl#Violation'
    }
  },
  OWL: {
    Class: 'http://www.w3.org/2002/07/owl#Class'
  },
  PidUriTemplate: {
    BaseUrl: environment.PidUriTemplate.BaseUrl,
    Prefix: 'https://pid.bayer.com/kos/19050#',
    HasBaseUrl: 'https://pid.bayer.com/kos/19050#hasBaseUrl',
    HasPidUriTemplateLifecycleStatus: 'https://pid.bayer.com/kos/19050/hasPidUriTemplateLifecycleStatus',
    LifecycleStatus: {
      Active: 'https://pid.bayer.com/kos/19050/active',
      Deprecated: 'https://pid.bayer.com/kos/19050/deprecated'
    }
  },
  ConsumerGroup: {
    HasPidUriTemplate: 'https://pid.bayer.com/kos/19050#hasPidUriTemplate',
    HasDefaultPidUriTemplate: 'https://pid.bayer.com/kos/19050/hasDefaultPidUriTemplate',
    HasConsumerGroupLifecycleStatus: 'https://pid.bayer.com/kos/19050/hasConsumerGroupLifecycleStatus',
    LifecycleStatus: {
      Active: 'https://pid.bayer.com/kos/19050/active',
      Deprecated: 'https://pid.bayer.com/kos/19050/deprecated'
    }
  },
  Authentication: {
    Roles: {
      Administration: 'COLID.Administration.ReadWrite',
      SuperAdministration: 'COLID.Superadministration.ReadWrite'
    }
  },
  Regex: {
    NaturalNumber: '^[0-9]*$',
    Guid: /(\{)?[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\})?/
  }
};
