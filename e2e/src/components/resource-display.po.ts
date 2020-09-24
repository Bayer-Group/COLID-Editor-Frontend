import { browser, by, element } from 'protractor';

export class ResourceDisplayPage {
  navigateToRoot() {
    return browser.get('/');
  }

  getResourceEditButton() {
    return element(by.id('button-resource-display-edit'));
  }

  getResourcePropertTextOutput(metaDataKey: string) {
    return element(by.id('text-resource-display-' + metaDataKey));
  }

  getMetaDataList() {
      return element.all(by.repeater('m in metaData'));
  }
}
