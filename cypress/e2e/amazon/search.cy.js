import searchAmazon from "../../support/page-objects/amazon/search";

describe("Booking ticket on Agoda", () => {
  it("Search", () => {
    searchAmazon.visit(Cypress.env('amazonUrl'))
  });
});