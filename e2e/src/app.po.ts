import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }
  getNavigationBar() {
    return element(by.className('navbar navbar-expand-sm navbar-dark bg-dark mb-3'));
  }
  getNavigationBarTitle() {
    return element(by.className('navbar-brand')).getText();
  }
  getWelcomePageTitle() {
      return element(by.className('h1'));
  }
  getWelcomePageSubtitle() {
      return element(by.className('lead'));
  }
  getWelcomePageNewResourceButton() {
      return element(by.id('button-welcome-resource-new'));
  }
}
