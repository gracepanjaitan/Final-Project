class searchAmazon {
  visit(url) {
    cy.visit(url);
  }

  searchProduct() {
    cy.get("#twotabsearchtextbox").clear().type("Chair");
    cy.get("#nav-flyout-searchAjax").should("be.visible");
    cy.get("#nav-search-submit-button").click();
    // menunggu hasil search tampil seluruhnya
    cy.wait(3000);
  }

  filter() {
    cy.get("#a-autoid-0-announce").click();
    cy.get(".a-popover-wrapper").should("be.visible");
    cy.get('ul[role="listbox"] li').eq(2).click();
    // menunggu hasil filter tampil seluruhnya
    cy.wait(3000);
    cy.get("#s-result-sort-select").should("contain", "Price: High to Low");
  }

  selectProduct() {
    cy.get('[data-component-type="s-search-result"]', { timeout: 10000 })
      .should("have.length.greaterThan", 0) // pastikan hasil ada
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

          cy.wrap($el).within(() => {
            cy.get('[data-cy="title-recipe"]')
              .invoke("text")
              .then((name) => {
                cy.wrap(name.trim()).as("selectedProductName");
              });
            cy.get('[data-cy="price-recipe"]')
              .invoke("text")
              .then((price) => {
                cy.wrap(price.trim()).as("selectedProductPrice");
              });
          });

          cy.wrap(rightmostItem).scrollIntoView().click();
        } else {
          cy.log("No non-sponsored items found in the first row.");
        }
      });
  }

  detailProduct() {
    //check product name
    cy.get("@selectedProductName").then((productName) => {
      cy.get("#title > #productTitle") // selector harga di detail
        .should("contain", productName);
    });

    //check product price
    cy.get("@selectedProductPrice").then((productPrice) => {
      const expected = productPrice.match(/\d+/)?.[0];

      cy.get(".a-price .a-price-whole") // coba selector harga di detail
        .first()
        .invoke("text")
        .then((actualText) => {
          const actual = actualText.match(/\d+/)?.[0];
          expect(actual).to.eq(expected);
        });
    });
  }
}
export default new searchAmazon();
