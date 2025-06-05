class searchYoutube {
  visit(url) {
    cy.visit(url);
  }

  trendingButton() {
    cy.get(
      ":nth-child(4) > #items > :nth-child(1) > #endpoint > tp-yt-paper-item.style-scope > .title"
    ).click();
    cy.get(".yt-core-attributed-string--white-space-pre-wrap").should(
      "contain.text",
      "Trending"
    );
  }

  movieButton() {
    cy.get('yt-tab-shape[tab-title="Movies"]')
      .should("have.attr", "role", "tab")
      .click();
  }

  movieTrending() {
    cy.wait(3000);
    cy.get("ytd-video-renderer", { timeout: 10000 })
      .eq(2)
      .then(($el) => {
        const text = $el.find("a#video-title").text().trim();
        const channelName = $el.find("ytd-channel-name a").text();

        cy.wrap(text).as("title");
        cy.wrap(channelName).as("channel");
        cy.wrap($el).find("a#video-title").click({ force: true });
      });
    cy.wait(3000);
  }

  movieDetail() {
    cy.get("@title").then((title) => {
      cy.get("h1.title yt-formatted-string", { timeout: 10000 }).should(
        "have.text",
        title
      );
    });

    // cy.get("@channel").then((channel) => {
    //   console.log('Nama channel (console):', channel);
    //   // cy.get('ytd-video-owner-renderer')
    //   // .find('ytd-channel-name #text a')
    //   // .should('be.visible')
    //   // .should('have.text',channel
    //   // );
    // });
  }
}
export default new searchYoutube();
