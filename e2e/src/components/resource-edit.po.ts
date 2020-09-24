import { browser, by, element } from 'protractor';

export class ResourceEditPage {
  navigateToRoot() {
    return browser.get('/');
  }
  
  getSideBarTitle() {
    return element(by.id('text-sidebar-title')).getText();
  }
  
  getResourceCancelButton() {
    return element(by.id('button-resource-form-cancel'));
  }

  getResourceRevertButton() {
    return element(by.id('button-resource-form-revert'));
  }

  getResourceSaveButton() {
    return element(by.id('button-resource-form-save'));
  }

  getResourcePublishButton() {
    return element(by.id('button-resource-form-publish'));
  }

  getResourcePropertyInputField(metaDataKey : string) {
    return element(by.id('input-resource-form-' + metaDataKey));
  }
}