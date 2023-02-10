import { environment } from 'src/environments/environment';

export const IDENT_PROV = "IdentityProvider";

export const Constants = {
  ResourceTypes: {
    ConsumerGroup: `https://pid.${environment.baseUrl}/kos/19050#ConsumerGroup`,
    MetadataGraphConfiguration: `https://pid.${environment.baseUrl}/kos/19050/367403`,
    PidUriTemplate: `https://pid.${environment.baseUrl}/kos/19050#PidUriTemplate`,
    ExtendedUriTemplate: `https://pid.${environment.baseUrl}/kos/19050#ExtendedUriTemplate`,
    Keyword: `https://pid.${environment.baseUrl}/kos/19050/Keyword`
  },
  Identifier: {
    Type: `http://pid.${environment.baseUrl}/kos/19014/PermanentIdentifier`
  },
  ControlledVocabulary: {
    HasInformationClassification: {
      Secret: `https://pid.${environment.baseUrl}/kos/19050/Secret`
    }
  },
  OntologyTypes: {
    Ontology: `http://pid.${environment.baseUrl}/kos/19014/Ontology`
  },
  Metadata: {
    Author: `https://pid.${environment.baseUrl}/kos/19050/author`,
    HasInformationClassification: `https://pid.${environment.baseUrl}/kos/19050/hasInformationClassification`,
    Type: {
      Decimal: 'http://www.w3.org/2001/XMLSchema#decimal',
      Boolean: 'http://www.w3.org/2001/XMLSchema#boolean',
      DateTime: 'http://www.w3.org/2001/XMLSchema#dateTime',
      String: 'http://www.w3.org/2001/XMLSchema#string',
      HTML: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML',
      Float: 'http://www.w3.org/2001/XMLSchema#float',
    },
    NodeType: {
      IRI: 'http://www.w3.org/ns/shacl#IRI',
      Literal: 'http://www.w3.org/ns/shacl#IRI'
    },
    NodeKind: 'http://www.w3.org/ns/shacl#nodeKind',
    EntityType: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    HasBaseUri: `https://pid.${environment.baseUrl}/kos/19050/hasBaseURI`,
    DateCreated: `https://pid.${environment.baseUrl}/kos/19050/dateCreated`,
    LastChangeDateTime: `https://pid.${environment.baseUrl}/kos/19050/lastChangeDateTime`,
    LastReviewDateTime: `https://pid.${environment.baseUrl}/kos/19050/hasLastReviewDate`,
    HasConsumerGroup: `https://pid.${environment.baseUrl}/kos/19050#hasConsumerGroup`,
    HasLastChangeUser: `https://pid.${environment.baseUrl}/kos/19050/lastChangeUser`,
    HasLastReviewer: `https://pid.${environment.baseUrl}/kos/19050/hasLastReviewer`,    
    HasResourceReviewCyclePolicy: `https://pid.${environment.baseUrl}/kos/19050/hasResourceReviewCyclePolicy`,
    HasNextReviewDueDate:`https://pid.${environment.baseUrl}/kos/19050/hasNextReviewDueDate`,
    HasVersion: `https://pid.${environment.baseUrl}/kos/19050/hasVersion`,
    HasPidUri: `http://pid.${environment.baseUrl}/kos/19014/hasPID`,
    HasTargetUri: `http://pid.${environment.baseUrl}/kos/19014/hasNetworkAddress`,
    PidUriTemplateIdType: `https://pid.${environment.baseUrl}/kos/19050#hasPidUriTemplateIdType`,
    PidUriTemplateSuffix: `https://pid.${environment.baseUrl}/kos/19050#hasPidUriTemplateSuffix`,
    Range: 'http://www.w3.org/2000/01/rdf-schema#range',
    MinCount: 'http://www.w3.org/ns/shacl#minCount',
    Name: 'http://www.w3.org/ns/shacl#name',
    ControlledVocabulary: `https://pid.${environment.baseUrl}/kos/19050#ControlledVocabulary`,
    Group: 'http://www.w3.org/ns/shacl#group',
    Order: 'http://www.w3.org/ns/shacl#order',
    MaxCount: 'http://www.w3.org/ns/shacl#maxCount',
    Datatype: 'http://www.w3.org/ns/shacl#datatype',
    Comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
    LifeCycleStatus: `https://pid.${environment.baseUrl}/kos/19050/hasEntryLifecycleStatus`,
    ColidEntryDraft: `https://pid.${environment.baseUrl}/kos/19050/hasDraft`,
    HasUriTemplate: `https://pid.${environment.baseUrl}/kos/19050/hasUriTemplate`,
    HasResourceDefinition: `https://pid.${environment.baseUrl}/kos/19050/hasResourceDefinition`,
    HasLabel: `https://pid.${environment.baseUrl}/kos/19050/hasLabel`,
    RdfsLabel: 'http://www.w3.org/2000/01/rdf-schema#label',
    Distribution: `https://pid.${environment.baseUrl}/kos/19050/distribution`,
    HasAttachment: `https://pid.${environment.baseUrl}/kos/19050/hasAttachment`,
    PointAt: `https://pid.${environment.baseUrl}/kos/19050/baseURIPointsAt`,
    MainDistribution: `https://pid.${environment.baseUrl}/kos/19050/mainDistribution`,
    Keywords: `https://pid.${environment.baseUrl}/kos/19050/47119343`,
    Pattern: 'http://www.w3.org/ns/shacl#pattern',
    HasLaterVersion: `https://pid.${environment.baseUrl}/kos/19050/hasLaterVersion`,
    MetadataReleaseConfig: `https://pid.${environment.baseUrl}/kos/19050/646465`,
    NetworkedResourceLabel: `https://pid.${environment.baseUrl}/kos/19050/hasNetworkedResourceLabel`,
    FieldType: `https://pid.${environment.baseUrl}/ns/shacl/fieldType`,
    FieldTypes: {
      ExtandableList: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#extendableList`
    },
    ContainsTherapeuticAreas : `https://pid.${environment.baseUrl}/d188c668-b710-45b2-9631-faf29e85ac8d/contains_information_about_therapeutic_area`,
    ContainsRwdDimensions: `https://pid.${environment.baseUrl}/d188c668-b710-45b2-9631-faf29e85ac8d/contains_rwd_dimension`,
    PreferredLabel: `https://pid.${environment.baseUrl}/kos/19050/PreferedLabel`,
    Definition: `https://pid.${environment.baseUrl}/kos/19050/Definition`,
    Placeholder: `https://pid.${environment.baseUrl}/graph/example`,
  },
  Display: {
    Header: `https://pid.${environment.baseUrl}/kos/19050/hasResourceDefinition`,
    SubHeader: `http://pid.${environment.baseUrl}/kos/19014/hasPID`
  },
  Person: {
    Type: `http://pid.${environment.baseUrl}/kos/19014/Person`
  },
  Resource: {
    // For Resource Id
    Prefix: `https://pid.${environment.baseUrl}/kos/19050#`,
    LifeCycleStatus: {
      Draft: `https://pid.${environment.baseUrl}/kos/19050/draft`,
      Published: `https://pid.${environment.baseUrl}/kos/19050/published`,
      Historic: `https://pid.${environment.baseUrl}/kos/19050/historic`,
      MarkedDeletion: `https://pid.${environment.baseUrl}/kos/19050/markedForDeletion`
    },
    Groups: {
      InvisibleTechnicalInformation: `http://pid.${environment.baseUrl}/kos/19050/InvisibleTechnicalInformation`,
      TechnicalInformation: `https://pid.${environment.baseUrl}/kos/19050/TechnicalInformation`,
      LinkTypes: `http://pid.${environment.baseUrl}/kos/19050/LinkTypes`,
      DistributionEndpoints: `http://pid.${environment.baseUrl}/kos/19050/DistributionEndpoints`,
      Images: `https://pid.${environment.baseUrl}/kos/19050/AttachmentsPropertyGroup`
    }
  },
  Shacl: {
    Range: 'http://www.w3.org/2000/01/rdf-schema#range',
    DefaultValue: 'http://www.w3.org/ns/shacl#defaultValue',
    Severity: {
      Info: 'http://www.w3.org/ns/shacl#Info',
      Warning: 'http://www.w3.org/ns/shacl#Warning',
      Violation: 'http://www.w3.org/ns/shacl#Violation'
    },
    String: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#string`,
    NaturalNumber: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#naturalNumber`,
    Number : `https://pid.${environment.baseUrl}/ns/shacl/fieldType#number`,
    DateTime : `https://pid.${environment.baseUrl}/ns/shacl/fieldType#dateTime`,
    HTML : `https://pid.${environment.baseUrl}/ns/shacl/fieldType#html`,
    Boolean: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#boolean`,
    List : `https://pid.${environment.baseUrl}/ns/shacl/fieldType#list`,
    ExtendableList : `https://pid.${environment.baseUrl}/ns/shacl/fieldType#extendableList`,
    Hierarchy : `https://pid.${environment.baseUrl}/ns/shacl/fieldType#hierarchy`,
    Identifier : `https://pid.${environment.baseUrl}/ns/shacl/fieldType#identifier`,
    Entity: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#entity`,
    Attachment: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#attachment`,
    LinkedEntity: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#linkedEntity`,
    Person: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#person`, 
  },
  OWL: {
    Class: 'http://www.w3.org/2002/07/owl#Class'
  },
  PidUriTemplate: {
    BaseUrl: environment.PidUriTemplate.BaseUrl,
    Prefix: `https://pid.${environment.baseUrl}/kos/19050#`,
    HasBaseUrl: `https://pid.${environment.baseUrl}/kos/19050#hasBaseUrl`,
    HasPidUriTemplateLifecycleStatus: `https://pid.${environment.baseUrl}/kos/19050/hasPidUriTemplateLifecycleStatus`,
    LifecycleStatus: {
      Active: `https://pid.${environment.baseUrl}/kos/19050/active`,
      Deprecated: `https://pid.${environment.baseUrl}/kos/19050/deprecated`
    }
  },
  ConsumerGroup: {
    HasPidUriTemplate: `https://pid.${environment.baseUrl}/kos/19050#hasPidUriTemplate`,
    HasDefaultPidUriTemplate: `https://pid.${environment.baseUrl}/kos/19050/hasDefaultPidUriTemplate`,
    HasDefaultReviewCyclePolicy: `https://pid.${environment.baseUrl}/kos/19050/hasDefaultReviewCyclePolicy`,
    HasConsumerGroupLifecycleStatus: `https://pid.${environment.baseUrl}/kos/19050/hasConsumerGroupLifecycleStatus`,
    LifecycleStatus: {
      Active: `https://pid.${environment.baseUrl}/kos/19050/active`,
      Deprecated: `https://pid.${environment.baseUrl}/kos/19050/deprecated`
    }
  },
  Attachment: {
    Type: `https://pid.${environment.baseUrl}/kos/19050/Attachment`,
    FileSize: `https://pid.${environment.baseUrl}/kos/19050/hasFileSize`,
    FileType: `https://pid.${environment.baseUrl}/kos/19050/hasFileType`,
    Comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
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
  },
  Assets: {
    Logo: `https://shared.${environment.baseUrl}/img/logo.svg`
  }
};

export const QuillEditorConfig = {
  Formats: [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'script',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    'code-block',
    'formula'
    // 'image'
    // 'video'
  ],

  Modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],      // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],             // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],       // outdent/indent
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],        // dropdown with defaults from theme
      [{ 'align': [] }],
      ['clean'],                                      // remove formatting button
      ['link']                                        // link
    ]
  }
};