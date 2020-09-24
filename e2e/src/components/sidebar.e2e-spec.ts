import { SidebarComponentPage } from './sidebar.po';
import { browser, element, by } from '../../../node_modules/protractor';

describe('Sidebar', () => {
  let page: SidebarComponentPage;

  beforeEach(() => {
    page = new SidebarComponentPage();
  });

  it('should display a title', () => {
    page.navigateTo();
    expect(page.getSideBarTitle()).toEqual('All resources');
  });

  it('should display a button to create a new resource', () => {
    page.navigateTo();
    expect(page.getSidebarNewResourceButton().getText()).toEqual('New...');
  });

  it('should display a filter bar', () => {
    page.navigateTo();
    expect(page.getSidebarFilterInput().getAttribute('class')).toContain('form-control');
    expect(page.getSidebarFilterInput().getAttribute('placeholder')).toEqual('Filter...');
  });

  it('should open resource view by clicking on first item in sidebar list', () => {
    page.navigateTo();

    var allVisibleResources = page.getSidebarResourceItems();
    allVisibleResources.first().click();

    element(by.id('item-sidebar-resource-0-name')).getText().then(async function (text) {
        var firstResourceName = await text.replace(/ /g, '_');
        expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/resource/view/' + firstResourceName);
    });
  });
});
