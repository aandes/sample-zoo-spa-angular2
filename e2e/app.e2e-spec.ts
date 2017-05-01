import { ProjSeedPage } from './app.po';

describe('proj-seed App', function() {
  let page: ProjSeedPage;

  beforeEach(() => {
    page = new ProjSeedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
