class searchAmazon {
  visit(url) {
    cy.visit(url);
  }

  searchProduct() {
    cy.get("#twotabsearchtextbox").clear().type("Chair");
    // cy.get("#nav-flyout-searchAjax").should("be.visible");
    cy.get("#nav-search-submit-button").click();

    cy.wait(3000);
  }

  filter() {
    cy.get("#a-autoid-0-announce").click();
    cy.get(".a-popover-wrapper").should("be.visible");
    cy.get('ul[role="listbox"] li').eq(2).click();
    cy.wait(3000);
    cy.get('#s-result-sort-select').should('contain', 'Price: High to Low')
  }

  selectProduct() {
    // Filter non-sponsored items
    // cy.get('[data-component-type="s-search-result"]')
    //   .not(':has([aria-label*="Sponsored"])')
    //   .eq(3) // ambil item keempat = paling kanan dari baris pertama
    //  .click();
    cy.get('[data-component-type="s-search-result"]', { timeout: 10000 })
    .should('have.length.greaterThan', 0) // pastikan hasil ada
    .then(($items) => {
      const firstRowTop = $items.first().offset().top;

      const firstRowItems = $items.filter((i, el) => {
        return Cypress.$(el).offset().top === firstRowTop;
      });

      const nonSponsored = firstRowItems.filter((i, el) => {
        return !Cypress.$(el).text().toLowerCase().includes("sponsored");
      });

      let rightmostItem = null;
      let maxLeft = -1;

      nonSponsored.each((i, el) => {
        const left = Cypress.$(el).offset().left;
        if (left > maxLeft) {
          maxLeft = left;
          rightmostItem = el;
        }
      });



      if (rightmostItem) {
        const $el = Cypress.$(rightmostItem);

        const name = $el.find('[data-cy="title-recipe"]')
        const price = $el.find('[data-cy="price-recipe"]')
        cy.wrap(name).as("selectedProductName");
        cy.wrap(price).as("selectedProductPrice");

        cy.wrap(rightmostItem).scrollIntoView().click()
       
      } else {
        cy.log('No non-sponsored items found in the first row.');
      }
    });
  }

  detailProduct() {
    cy.get("@selectedProductName").then((productName) => {
      cy.get('#title > #productTitle') // selector Amazon untuk judul produk
        .should("contain", productName);
    });
    
    cy.get("@selectedProductPrice").then((productPrice) => {
      cy.get(".a-price .a-price-whole") // coba selector harga di detail
        .should("contain", productPrice);
    });
    
  }
}
export default new searchAmazon();
