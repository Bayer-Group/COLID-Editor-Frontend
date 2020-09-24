import { browser, by, element } from 'protractor';

export class SidebarComponentPage {
  navigateTo() {
    return browser.get('/');
  }
  
  getSideBarTitle() {
    return element(by.id('text-sidebar-title')).getText();
  }

  getSidebarNewResourceButton() {
      return element(by.id('button-sidebar-resource-new'));
  }
  
  getSidebarFilterInput() {
    return element(by.id('input-sidebar-resource-filter'));
  }

  getSidebarResourceItems() {
      return element(by.id('list-sidebar-resources')).all(by.tagName('li'));
  }
}
