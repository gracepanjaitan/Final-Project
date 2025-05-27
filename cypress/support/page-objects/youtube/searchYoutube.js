class searchYoutube {
    visit (url) {
        cy.visit(url)
    }

    trendingButton(){
        cy.get(':nth-child(4) > #items > :nth-child(1) > #endpoint > tp-yt-paper-item.style-scope').click()
    }

    movieButton() {
        cy.get('.yt-tab-shape-wiz__tab--last-tab').click()
    }

    movieTrending () {
        cy.contains('Jalan Pulang - Official Trailer').invoke('text').then((text) => {
            cy.log('Teks yang didapatkan', text);
            cy.wrap(text).as('newTitle');
        })
    }

    movieDetail () {
        cy.contains ('Jalan Pulang - Official Trailer').click();
        cy.get('@newTitle', {timeout: 10000}).then((title) => {
            cy.log(title);
            cy.get('[title="Jalan Pulang - Official Trailer"]').should('contain', title);
        })
    }
}
export default new searchYoutube()