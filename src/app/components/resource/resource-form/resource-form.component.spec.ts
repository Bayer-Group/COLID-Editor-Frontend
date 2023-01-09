import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxsModule, Store } from '@ngxs/store';
import { ResourceFormComponent } from './resource-form.component';
import { ResourceState } from '../../../state/resource.state';
import { MetaDataState } from '../../../state/meta-data.state';
import { FetchResource } from '../../../actions/resource.action';
import { Resource } from '../../../model/resource';
import { environment } from '../../../../environments/environment';
import { FetchMetaData } from '../../../actions/meta-data.actions';
import { MetaDataProperty } from '../../../shared/models/metadata/meta-data-property';
import { ResourceProperty } from '../../../model/resource-property';

function createResourceProperty(key: string, value: string, type: string, dataType: string): ResourceProperty {
    const property = new ResourceProperty();
    property.key = key;
    property.type = type;
    property.value = value;
    property.dataType = dataType;
    return property;
}

function createTestResource(): Resource {
    let testResource: Resource;
    testResource = new Resource();
    testResource.properties = new Array<ResourceProperty>();

    testResource.properties.push(createResourceProperty('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://pid.bayer.com/kos/19050#Resource', 'uri', null));
    testResource.properties.push(createResourceProperty('http://schema.org/accessibilityAPI', 'HTTP', 'literal', null));
    testResource.properties.push(createResourceProperty('http://schema.org/version', '1.0', 'literal', 'http://www.w3.org/2001/XMLSchema#float'));
    testResource.properties.push(createResourceProperty('http://www.w3.org/2004/02/skos/core#altLabel', 'Business Ontology Bayer Companies', 'literal', null));
    testResource.properties.push(createResourceProperty('http://www.w3.org/2004/02/skos/core#definition', 'Overview of the Bayer Companies', 'literal', null));
    testResource.properties.push(createResourceProperty('http://www.w3.org/2004/02/skos/core#editorialNote', 'Includes: Country, Region, Currency and Languages', 'literal', null));
    testResource.properties.push(createResourceProperty('http://www.w3.org/2004/02/skos/core#prefLabel', 'Bayer Companies Ontology', 'literal', null));
    testResource.properties.push(createResourceProperty('https://pid.bayer.com/kos/19050#author', 'EUBLC', 'literal', null));
    testResource.properties.push(createResourceProperty('https://pid.bayer.com/kos/19050#dateCreated', '2018-07-02T17:10:08', 'literal', 'http://www.w3.org/2001/XMLSchema#dateTime'));
    testResource.properties.push(createResourceProperty('https://pid.bayer.com/kos/19050#dateModified', '2018-07-11T17:10:13', 'literal', 'http://www.w3.org/2001/XMLSchema#dateTime'));
    testResource.properties.push(createResourceProperty('https://pid.bayer.com/kos/19050#hasBusinessDomain', 'https://pid.bayer.com/kos/19050/taxonomies#ControllingFinance', 'uri', null));

    return testResource;
}

function createTestMetadata (
    key: string,
    pidUri: string,
    name: string,
    description: string,
    type: string,
    isMandatory: boolean,
    isReadOnly: boolean,
    controlledVocabulary: any): MetaDataProperty {
        const testMetadataProperty = new MetaDataProperty();
        testMetadataProperty.key = key;
        testMetadataProperty.name = name;
        testMetadataProperty.pidUri = pidUri;
        testMetadataProperty.description = description;
        testMetadataProperty.type = type;
        testMetadataProperty.isMandatory = isMandatory;
        testMetadataProperty.isReadOnly = isReadOnly;
        testMetadataProperty.controlledVocabulary = controlledVocabulary;

        return testMetadataProperty;
}

function createTestMetadataList(): Array<MetaDataProperty> {
    const testMetadata = new Array<MetaDataProperty>();
    createTestMetadata('author', 'https://pid.bayer.com/kos/19050#author', 'Author', 'Original Author, name of the user (CWID or system user) who has introduced the item', 'http://www.w3.org/2001/XMLSchema#string', true, false, null);
    createTestMetadata('dateCreated', 'https://pid.bayer.com/kos/19050#dateCreated', 'Creation date and time', 'Creation date/time', 'http://www.w3.org/2001/XMLSchema#dateTime', true, false, null);
    createTestMetadata('dateModified', 'https://pid.bayer.com/kos/19050#dateModified', 'Last change date and time', 'Last Change date and time', 'http://www.w3.org/2001/XMLSchema#dateTime', true, false, null);
    createTestMetadata('hasBusinessDomain', 'https://pid.bayer.com/kos/19050#hasBusinessDomain', 'Business Domain', 'In what kind of business domain the item is categorized', 'https://pid.bayer.com/kos/19050#BusinessDomain', true, false, null);
    createTestMetadata('hasDataAccessLimitation', 'https://pid.bayer.com/kos/19050#hasDataAccessLimitation', 'Data Access Limitation', 'Controlled vocabulary for the Data Access.', 'https://pid.bayer.com/kos/19050#DataAccessLimitation', false, false, null);
    createTestMetadata('hasDataSteward', 'https://pid.bayer.com/kos/19050#hasDataSteward', 'Data Steward', 'Name of the data steward (CWID) of the source.', 'http://www.w3.org/2001/XMLSchema#string', false, false, null);
    createTestMetadata('hasInformationClassification', 'https://pid.bayer.com/kos/19050#hasInformationClassification', 'Information Classification', 'Bayer Information Classification levels as they apply to the registered Information.', 'https://pid.bayer.com/kos/19050#InformationClassification', true, false, null);
    createTestMetadata('hasLastChangeUser', 'https://pid.bayer.com/kos/19050#hasLastChangeUser', 'Last change user', 'Name of the last user or system, who has changed the Item.', 'http://www.w3.org/2001/XMLSchema#string', true, false, null);
    createTestMetadata('hasLifecycleStatus', 'https://pid.bayer.com/kos/19050#hasLifecycleStatus', 'Lifecycle Status', 'Indicates the maturity of an object.', 'https://pid.bayer.com/kos/19050#LifecycleStatus', true, false, null);
    createTestMetadata('hasPIDURI', 'https://pid.bayer.com/kos/19050#hasPIDURI', 'PID URI', 'URI (URL) provided by PID.', 'http://www.w3.org/2001/XMLSchema#anyURI', true, false, null);
    createTestMetadata('hasTargetURI', 'https://pid.bayer.com/kos/19050#hasTargetURI', 'Target URI', 'Original external or internal non-PID address (URL)', 'http://www.w3.org/2001/XMLSchema#anyURI', true, false, null);
    createTestMetadata('hasTrustLevel', 'https://pid.bayer.com/kos/19050#hasTrustLevel', 'Trust Level', 'How trustworthy is the source.', 'https://pid.bayer.com/kos/19050#TrustLevel', false, false, null);
    createTestMetadata( 'isPersonalData', 'https://pid.bayer.com/kos/19050#isPersonalData', 'Personal Data', 'In the sense of GDPR and internal rules', 'http://www.w3.org/2001/XMLSchema#boolean', true, false, null);
    createTestMetadata( 'hasDataQuality', 'https://pid.bayer.com/kos/19050#hasDataQuality', 'Data Quality', 'Linked Data Quality status', 'https://pid.bayer.com/kos/19050#DataQuality', false, false, null);
    return testMetadata;
}

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;
  let store: Store;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceFormComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FontAwesomeModule,
        NgxsModule.forRoot([ResourceState, MetaDataState]),
      ]
    })
      .compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update active resource on changes through store', waitForAsync(() => {
    store.dispatch(new FetchResource('testing_key'));

    const resourceRequest = httpMock.expectOne(environment.colidApiUrl + '/resource/' + 'testing_key');
    const returnedResource = new Resource();
    returnedResource.key = 'key_under_test';
    returnedResource.properties = new Array<ResourceProperty>();

    const property = new ResourceProperty();
    property.key = 'prop_key';
    property.value = 'prop_value';
    property.dataType = 'prop_datatype';
    property.type = 'prop_type';
    returnedResource.properties.push(property);
    resourceRequest.flush(returnedResource);

    // register for testing the component resource itself
    component.activeResource$.forEach(resource => {
        expect(resource.key).toBe('key_under_test');
    });

    // register for testing the subscription changes
    component.activeResource$.subscribe(state => {
        expect(state.key).toBe('key_under_test');
    });
  }));

  it('should update meta data on changes through store', waitForAsync(() => {
    store.dispatch(new FetchMetaData());

    const resourceRequest = httpMock.expectOne(environment.colidApiUrl + '/metadata');
    const returnedMetaData = new MetaDataProperty();
    returnedMetaData.key = 'key';
    returnedMetaData.name = 'name';
    returnedMetaData.pidUri = 'pid_uri';
    returnedMetaData.description = 'colid_description';
    returnedMetaData.type = 'type';
    returnedMetaData.isMandatory = true;
    returnedMetaData.isReadOnly = false;
    returnedMetaData.controlledVocabulary = 'any';

    resourceRequest.flush([returnedMetaData]);

    // register for testing the component resource itself
    component.metaData$.forEach(metaDataList => {
        expect(metaDataList[0].key).toBe('key');
        expect(metaDataList[0].name).toBe('name');
        expect(metaDataList[0].pidUri).toBe('pid_uri');
        expect(metaDataList[0].description).toBe('colid_description');
        expect(metaDataList[0].type).toBe('type');
        expect(metaDataList[0].isMandatory).toBe(true);
        expect(metaDataList[0].isReadOnly).toBe(false);
        expect(metaDataList[0].controlledVocabulary).toBe('any');
    });

    // register for testing the subscription changes
    component.metaData$.subscribe(metaDataList => {
        expect(metaDataList[0].key).toBe('key');
        expect(metaDataList[0].name).toBe('name');
        expect(metaDataList[0].pidUri).toBe('pid_uri');
        expect(metaDataList[0].description).toBe('colid_description');
        expect(metaDataList[0].type).toBe('type');
        expect(metaDataList[0].isMandatory).toBe(true);
        expect(metaDataList[0].isReadOnly).toBe(false);
        expect(metaDataList[0].controlledVocabulary).toBe('any');
    });
  }));

  it('should build ontology form with all meta data', () => {
    component.metaData = createTestMetadataList();
    component.resource = createTestResource();
  });
});
