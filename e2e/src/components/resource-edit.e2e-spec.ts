import { browser, element, by } from '../../../node_modules/protractor';
import { ResourceEditPage } from './resource-edit.po';
import { SidebarComponentPage } from './sidebar.po';
import { ResourceDisplayPage } from './resource-display.po';

describe('ResourceEditPage', () => {
  let resourceEditPage: ResourceEditPage;
  let resourceDisplayPage: ResourceDisplayPage;
  let sidebarPage: SidebarComponentPage;

  beforeEach(() => {
    resourceEditPage = new ResourceEditPage();
    resourceDisplayPage = new ResourceDisplayPage();
    sidebarPage = new SidebarComponentPage();
  });

  it('should open resource and edit a field in the database', () => {
    resourceEditPage.navigateToRoot();

    var allVisibleResources = sidebarPage.getSidebarResourceItems();
    allVisibleResources.first().click();

    var resourceName : string;
    var resourcePropertyTextBeforeEdit: string;

    element(by.id('item-sidebar-resource-0-name')).getText().then(function (text) {
        resourceName = text.replace(/ /g, '_');
        expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/resource/view/' + resourceName);
        //expect(resourceDisplayPage.getMetaDataList().count()).toEqual(21);
        
    })
    .then(() => resourceDisplayPage.getResourcePropertTextOutput('hasDataSteward'))
    .then((textOutputDataSteward) => {
        expect(textOutputDataSteward.isPresent()).toBe(true);
        return textOutputDataSteward;

    })
    .then((textOutputDataSteward) => textOutputDataSteward.getText())
    .then((textOutputDataStewardText) => {
        // save the old value for later comparison between viewing and editing
        resourcePropertyTextBeforeEdit = textOutputDataStewardText;
        browser.sleep(1500);
        resourceDisplayPage.getResourceEditButton().click()
        expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/resource/edit/' + resourceName);

    })
    .then(() => resourceEditPage.getResourcePropertyInputField('hasDataSteward'))
    .then((inputFieldDataSteward) => {
        expect(inputFieldDataSteward.isPresent()).toBe(true);
        return inputFieldDataSteward;

    })
    .then((inputFieldDataSteward) => {
        expect(inputFieldDataSteward.getAttribute('value')).toEqual(resourcePropertyTextBeforeEdit);
        inputFieldDataSteward.clear();
        expect(inputFieldDataSteward.getAttribute('value')).toEqual('');
        return inputFieldDataSteward;

    })
    .then((inputFieldDataSteward) => {
        inputFieldDataSteward.sendKeys('ABCDEF');
        browser.sleep(1500);
        expect(inputFieldDataSteward.getAttribute('value')).toEqual('ABCDEF');

    })
    .then(() => resourceEditPage.getResourcePropertyInputField('version'))
    .then((inputFieldVersion) => {
        inputFieldVersion.sendKeys('1.0');
        browser.sleep(1500);
        expect(inputFieldVersion.getAttribute('value')).toEqual('1.0');

        resourceEditPage.getResourcePublishButton().click()
        expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/resource/view/' + resourceName);
    });
  });
});
