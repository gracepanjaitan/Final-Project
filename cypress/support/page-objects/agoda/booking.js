import dayjs from "dayjs";

class agodaBooking {
  visit(url) {
    cy.visit(url);
  }

  getFlightForm() {
    cy.get("#tab-flight-tab > .Box-sc-kv6pi1-0").click();
    cy.get(".a84bc-bg-product-primary-subtle").should("be.visible");
  }

  getFlyingFromCode(flyingFrom, fromCode) {
    cy.get("#flight-origin-search-input").click().type(flyingFrom);
    cy.contains(`${fromCode}`).click();
    cy.get("#flight-origin-search-input")
      .should("be.visible")
      .should("have.value", `${flyingFrom} (${fromCode})`);
  }

  getFlyingToCode(flyingTo, toCode) {
    cy.get("#flight-destination-search-input").click().type(flyingTo);
    cy.contains(`${toCode}`).click();
    cy.get("#flight-destination-search-input")
      .should("be.visible")
      .should("have.value", `${flyingTo} (${toCode})`);
    cy.get('[data-selenium="range-picker-date"]')
      .should("exist")
      .and("be.visible");
  }

  selectDepartureDate(date) {
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

    cy.get(`[data-selenium-date="${tomorrow}"]`)
      .should("be.visible") // pastikan elemen ada
      .closest('div[role="button"]') // naik ke tombol klik-nya
      .click(); // klik tombol
  }

  sendForm() {
    cy.get("#flight-occupancy > .Box-sc-kv6pi1-0").click();
    cy.get('[data-test="SearchButtonBox"]').click();
  }

  filter() {
    cy.xpath(
      `//button[contains(.,'Show all') and contains(.,'airlines')]`
    ).click();

    //check apakah maskapai yang diinginkan masih tersedia atau tidak
    cy.get('[data-element-name="flight-filter-airline-item"]').then(
      ($airlines) => {
        const airlineLabels = [...$airlines].map((el) =>
          el.getAttribute("data-element-value")
        );

        // check maskapai Malaysia Airlines
        if (airlineLabels.includes("Malaysia Airlines")) {
          cy.contains("[data-element-value]", "Malaysia Airlines")
            .find('input[type="checkbox"]')
            .check({ force: true });

          // check maskapai Batik Air
        } else if (airlineLabels.includes("Batik Air (Malaysia)")) {
          cy.contains("[data-element-value]", "Batik Air (Malaysia)")
            .find('input[type="checkbox"]')
            .check({ force: true });

          // check maskapai Jetstar Asia
        } else if (airlineLabels.includes("Jetstar Asia")) {
          cy.contains("[data-element-value]", "Jetstar Asia")
            .find('input[type="checkbox"]')
            .check({ force: true });
        } else {
          cy.log("Tidak ada maskapai yang cocok ditemukan.");
        }
      }
    );
  }

  sortbyDepartureTime() {
    cy.xpath(`//button[contains(.,'Sort by')]`).click();
    cy.get('[data-testid="floater-container"]').should("be.visible");
    cy.get('ul[role="listbox"] li').eq(3).find("button").click();
  }

  selectFlightSchedule() {
    cy.wait(5000)
    cy.get('[data-testid="flightCard-flight-detail"]', { timeout: 5000 })
      .eq(0)
      .click();
    cy.wait(5000);
    cy.get('[data-component="flight-card-bookButton"]')
      .should("be.visible")
      .click();
  }

  contactDetailsForm(first_name) {
    cy.fixture("contactDetails.json").as("contact");
    cy.get("@contact").then((contactData) => {
      cy.get('[data-testid="contact.contactFirstName"]').type(
        contactData.first_name
      );
      cy.get('[data-testid="contact.contactLastName"]').type(
        contactData.last_name
      );
      cy.get('[data-testid="contact.contactEmail"]').type(contactData.email);
      cy.get(
        '[data-testid="contact.contactPhoneNumber-PhoneNumberDataTestId"]'
      ).type(contactData.phone_number);
      cy.get('input[aria-label="Female"]').check({ force: true });
    });
  }

  passengersForm() {
    cy.fixture("passenger.json").as("passenger");
    cy.get("@passenger").then((passengerData) => {
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerFirstName"]'
      ).type(passengerData.first_middle_name);
      cy.get('[data-testid="flight.forms.i0.units.i0.passengerLastName"]').type(
        passengerData.last_name
      );
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerDateOfBirth-DateInputDataTestId"]'
      ).type(passengerData.day);
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerDateOfBirth-MonthInputDataTestId"]'
      ).click();
      cy.get('[data-testid="floater-container"]').should("be.visible");
      cy.get('[name="dropdown-list-item"]');
      cy.get("li").contains(passengerData.month).click();
      cy.get(
        '[datatestid="flight.forms.i0.units.i0.passengerDateOfBirth-YearInputDataTestId"]'
      ).type(passengerData.year);
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerNationality"]'
      ).click();
      cy.get("li").contains(passengerData.nationality).click();
      cy.get(
        '[data-testid="kite-box"] > :nth-child(1) > .a5d86-bg-product-primary'
      ).click();
    });
  }

  payment() {
    cy.get('[data-testid="continue-to-payment-button"]').click();
  }
}

export default new agodaBooking();
