import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('COLID App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display COLID title', () => {
    page.navigateTo();
    expect(page.getNavigationBarTitle()).toEqual('COLID 1.0');
  });

  it('should show navigation bar', () => {
    page.navigateTo();
    expect(page.getNavigationBar()).toBeDefined;
  });

  it('should redirect to and display welcome page', () => {
    page.navigateTo();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/resource/welcome');
    browser.waitForAngular();

    expect(page.getWelcomePageTitle().getText()).toEqual('Welcome to COLID!');
    expect(page.getWelcomePageSubtitle().getText()).toEqual('COLID: The answer to life, the universe and everything.');
  });

  it('should display a button to create a new resource on welcome page', () => {
    page.navigateTo();
    browser.waitForAngular();
    expect(page.getWelcomePageNewResourceButton().getText()).toEqual('Register a new resource');
  });
});
