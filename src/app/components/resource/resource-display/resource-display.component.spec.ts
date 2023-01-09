import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ResourceDisplayComponent } from './resource-display.component';
import { MetaDataState } from '../../../state/meta-data.state';
import { ResourceState } from '../../../state/resource.state';
import { Resource } from '../../../model/resource';
import { ResourceProperty } from '../../../model/resource-property';
import { FetchMetaData } from '../../../actions/meta-data.actions';
import { FetchResource } from '../../../actions/resource.action';
import { environment } from '../../../../environments/environment';
import { MetaDataProperty } from '../../../shared/models/metadata/meta-data-property';

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

function createTestVocabulary() {
    return {
        '<http://pid.bayer.com/taxonomies/BusinessDomain#Billing>': 'Billing',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#BusinessDomain>': 'Business Domain',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#ChropScienceRD>': 'Crop Science R&D',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#ControllingFinance>': 'Controlling & Finance',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#CoreDataSet>': 'Core Data Set',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#HR>': 'HR',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#Logistic>': 'Logistic',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#MarketingSales>': 'Marketing & Sales',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#PharmaRD>': 'Pharma R&D',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#Procurement>': 'Procurement',
        '<http://pid.bayer.com/taxonomies/BusinessDomain#StrategicManagement>': 'Strategic Management'
    };
}

describe('ResourceDisplayComponent', () => {
  let component: ResourceDisplayComponent;
  let fixture: ComponentFixture<ResourceDisplayComponent>;
  let store: Store;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceDisplayComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([MetaDataState, ResourceState]),
        FontAwesomeModule
      ]
    })
      .compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update resource on changes through store', waitForAsync(() => {
    store.dispatch(new FetchResource('testing_key'));

    const resourceRequest = httpMock.expectOne(environment.colidApiUrl + '/resource/' + 'testing_key');
    const returnedResource = new Resource();
    returnedResource.key = 'key_under_test';
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

    // httpMock.expectOne(environment.colidApiUrl + '/metadata').flush([returnedResource, new MetaDataProperty()]);
  }));

  it('#getResourcePropertyValue should return correct property entries', () => {
    const testResource = createTestResource();

    expect(component.getResourcePropertyValue(testResource, 'altLabel')).toBe('Business Ontology Bayer Companies');
    expect(component.getResourcePropertyValue(testResource, 'definition')).toBe('Overview of the Bayer Companies');
    expect(component.getResourcePropertyValue(testResource, 'dateCreated')).toBe('2018-07-02T17:10:08');
  });

  it('#getResourcePropertyValue should not return any values on empty resource properties', () => {
    const emptyTestResource = new Resource();

    expect(component.getResourcePropertyValue(emptyTestResource, 'altLabel')).toBe('');
    expect(component.getResourcePropertyValue(emptyTestResource, 'dateModified')).toBe('');
    expect(component.getResourcePropertyValue(emptyTestResource, 'hasBusinessDomain')).toBe('');
  });

  it('#getResourcePropertyValue should return empty if no entry found in resource', () => {
    const testResource = createTestResource();

    expect(component.getResourcePropertyValue(testResource, 'noValidMetaData')).toBe('');
    expect(component.getResourcePropertyValue(testResource, 'anotherInvalidMetaData')).toBe('');

    expect(component.getResourcePropertyValue(testResource, 'dateModified')).toBe('2018-07-11T17:10:13');
    expect(component.getResourcePropertyValue(testResource, 'hasBusinessDomain')).toBe('https://pid.bayer.com/kos/19050/taxonomies#ControllingFinance');
  });

  it('#propToArray should return correct entries for a dictionary', () => {
    const testVocabulary = {'key': 'value'};
    const actualResult = component.propToArray(testVocabulary)[0];

    expect(actualResult[0]).toBe('key');
    expect(actualResult[1]).toBe('value');
  });

  it('#propToArray should return correct entries for vocabulary dictionary', () => {
    const actualResult = component.propToArray(createTestVocabulary());

    expect(actualResult[0][0]).toBe('<http://pid.bayer.com/taxonomies/BusinessDomain#Billing>');
    expect(actualResult[0][1]).toBe('Billing');

    expect(actualResult[1][0]).toBe('<http://pid.bayer.com/taxonomies/BusinessDomain#BusinessDomain>');
    expect(actualResult[1][1]).toBe('Business Domain');

    expect(actualResult[10][0]).toBe('<http://pid.bayer.com/taxonomies/BusinessDomain#StrategicManagement>');
    expect(actualResult[10][1]).toBe('Strategic Management');
  });

  it('#propToArray should be undefined for empty dictionary', () => {
    const actualResult = component.propToArray({});

    expect(actualResult[0]).toBe(undefined);
  });

  it('#propToArray should be translated for each object of input arrays', () => {
    const actualResult = component.propToArray(['val1', 'val2']);

    expect(actualResult[0][0]).toBe('0');
    expect(actualResult[0][1]).toBe('val1');

    expect(actualResult[1][0]).toBe('1');
    expect(actualResult[1][1]).toBe('val2');
  });

  it('#checkUrl should return true for correct url in resource', () => {
    const testResource = createTestResource();

    let metaDataKey = 'type';
    let actualResult = component.checkUrl(testResource, metaDataKey);
    expect(actualResult).toBe(true);

    metaDataKey = 'hasBusinessDomain';
    actualResult = component.checkUrl(testResource, metaDataKey);
    expect(actualResult).toBe(true);
  });

  it('#checkUrl should return false for no url in resource', () => {
    const testResource = createTestResource();

    let metaDataKey = 'altLabel';
    let actualResult = component.checkUrl(testResource, metaDataKey);
    expect(actualResult).toBe(false);

    const metaDataKey = 'dateCreated';
    actualResult = component.checkUrl(testResource, metaDataKey);
    expect(actualResult).toBe(false);
  });

  it('#checkUrl should return false for undefined meta data key', () => {
    const testResource = createTestResource();

    const metaDataKey = 'abcdef';
    const actualResult = component.checkUrl(testResource, metaDataKey);
    expect(actualResult).toBe(false);
  });

  it('#checkUrl should return correct values for different urls', () => {
    const testResource = new Resource();
    testResource.properties = new Array<ResourceProperty>();
    testResource.properties.push(createResourceProperty('url_1', 'ftp://usr:pw@url.tld/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_2', 'http://usr:pw@url.tld/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_3', 'https://usr:pw@url.tld/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_4', 'https://url.tld/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_5', 'https://url.tld./test', 'uri', null));

    // blocking local IP adresses
    testResource.properties.push(createResourceProperty('url_6', 'https://10.10.10.10/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_7', 'https://127.10.10.10/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_8', 'https://169.254.0.1/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_9', 'https://192.168.0.1/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_10', 'https://0.0.0.0/test', 'uri', null));

    testResource.properties.push(createResourceProperty('url_11', 'https://120.120.120.123/test', 'uri', null));
    testResource.properties.push(createResourceProperty('url_12', 'https://223.255.255.254/test', 'uri', null));

    expect(component.checkUrl(testResource, 'url_1')).toBe(true);
    expect(component.checkUrl(testResource, 'url_2')).toBe(true);
    expect(component.checkUrl(testResource, 'url_3')).toBe(true);
    expect(component.checkUrl(testResource, 'url_4')).toBe(true);
    expect(component.checkUrl(testResource, 'url_5')).toBe(true);

    expect(component.checkUrl(testResource, 'url_6')).toBe(false);
    expect(component.checkUrl(testResource, 'url_7')).toBe(false);
    expect(component.checkUrl(testResource, 'url_8')).toBe(false);
    expect(component.checkUrl(testResource, 'url_9')).toBe(false);
    expect(component.checkUrl(testResource, 'url_10')).toBe(false);

    expect(component.checkUrl(testResource, 'url_11')).toBe(true);
    expect(component.checkUrl(testResource, 'url_12')).toBe(true);
  });
});
