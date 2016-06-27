import { GowaFrontendPage } from './app.po';

describe('gowa-frontend App', function() {
  let page: GowaFrontendPage;

  beforeEach(() => {
    page = new GowaFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
