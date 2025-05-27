import searchYoutube from '../../support/page-objects/youtube/searchYoutube';

describe('Searching Youtube', () => {
  it('search the trending', () => {
    searchYoutube.visit(Cypress.env('youtubeUrl'));
    cy.wait(10000)
    searchYoutube.trendingButton();
    searchYoutube.movieButton();
    searchYoutube.movieTrending()
    searchYoutube.movieDetail();
  })
});
