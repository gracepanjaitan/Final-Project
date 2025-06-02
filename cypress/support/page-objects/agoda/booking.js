import dayjs from "dayjs";

class agodaBooking {
  visit(url) {
    cy.visit(url);
  }

  getFlightForm() {
    cy.get("#tab-flight-tab > .Box-sc-kv6pi1-0").click();
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
    cy.wait(5000);
    cy.get('[data-testid="flightCard-flight-detail"]').eq(0).click();

    //wrap departure + arrival time
    // cy.get('[data-testid="departure-time"]')
    //   .invoke("text")
    //   .then((departureTime) => {
    //     cy.get('[data-testid="arrival-time"]')
    //       .invoke("text")
    //       .then((arrivalTime) => {
    //         const flightTime = `${departureTime.trim()} - ${arrivalTime.trim()}`;
    //         cy.wrap(flightTime).as("flightTime");
    //       });
    //   });

    cy.get('[data-testid="departure-time"]').invoke("text").as('departureTime')
    cy.get('[data-testid="arrival-time"]').invoke('text').as('arrivalTime')

    cy.wait(5000);
    cy.get('[data-component="flight-card-bookButton"]')
      .should("be.visible")
      .click();
  }

  contactDetailsForm() {
    cy.wait(10000);
    // Get ticket price
    cy.get('[data-component="mob-flight-price-total-desc"]')
      .invoke("text")
      .as("selectedPrice");

    cy.fixture("contactDetails.json").as("contact");
    cy.get("@contact").then((contactData) => {
      // fill first name of booker
      cy.get('[data-testid="contact.contactFirstName"]').type(
        contactData.first_name
      );

      // fill last name of booker
      cy.get('[data-testid="contact.contactLastName"]').type(
        contactData.last_name
      );

      //fill email of booker
      cy.get('[data-testid="contact.contactEmail"]').type(contactData.email);

      //fill phones's number booker
      cy.get(
        '[data-testid="contact.contactPhoneNumber-PhoneNumberDataTestId"]'
      ).type(contactData.phone_number);
      cy.get('input[aria-label="Female"]').check({ force: true });
    });
  }

  passengersForm() {
    cy.wait(5000);
    cy.fixture("passenger.json").as("passenger");
    cy.get("@passenger").then((passengerData) => {
      //fill passenger first name + middle
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerFirstName"]'
      ).type(passengerData.first_middle_name);

      //fill passenger last name
      cy.get('[data-testid="flight.forms.i0.units.i0.passengerLastName"]').type(
        passengerData.last_name
      );

      // wrap as full name
      cy.wrap(
        `${passengerData.first_middle_name} ${passengerData.last_name}`
      ).as("fullName");

      //fill passenger day of birth
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerDateOfBirth-DateInputDataTestId"]'
      ).type(passengerData.day_birth);

      //fill passenger month of birth
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerDateOfBirth-MonthInputDataTestId"]'
      ).click();
      cy.get('[data-testid="floater-container"]').should("be.visible");
      cy.get('[name="dropdown-list-item"]');
      cy.get("li").contains(passengerData.month_birth).click();

      //fill passenger year of birth
      cy.get(
        '[datatestid="flight.forms.i0.units.i0.passengerDateOfBirth-YearInputDataTestId"]'
      ).type(passengerData.year_birth);
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passengerNationality"]'
      ).click();
      cy.get("li").contains(passengerData.nationality).click();

      //Check apakah field passport ada atau tidak
      cy.get("body").then(($body) => {
        // cek apakah elemen passport number ada
        if (
          $body.find(
            'input[data-testid="flight.forms.i0.units.i0.passportNumber"]'
          ).length > 0
        ) {
          cy.get('input[data-testid="flight.forms.i0.units.i0.passportNumber"]')
            .type(passengerData.passport)
            //wrap the passport
            .invoke("val")
            .then((val) => {
              // simpan sebagai alias di luar chaining
              Cypress.env("passengerPassport", val);
            });

          cy.get(
            '[data-testid="flight.forms.i0.units.i0.passportCountryOfIssue"]'
          ).click();
          cy.get("li").contains(passengerData.region_issue).click();
          cy.get(
            '[datatestid="flight.forms.i0.units.i0.passportExpiryDate-DateInputDataTestId"]'
          ).type(passengerData.day_expire);
          // Step 1: Klik dropdown bulan
          cy.get(
            '[data-testid="flight.forms.i0.units.i0.passportExpiryDate-MonthInputDataTestId"] button'
          ).click();

          // Step 2: Pilih bulan "May" dari list item
          cy.get("li").contains(passengerData.month_expire).click();

          cy.get("li").contains(passengerData.month_expire).click();
          cy.get(
            '[data-testid="flight.forms.i0.units.i0.passportExpiryDate-YearInputDataTestId"]'
          ).type(passengerData.year_expire);
        } else {
          cy.log("Passport number field not present – skipping");
        }
      });
    });
  }

  payment() {
    cy.get('[data-testid="kite-box"] button.a5d86-bg-product-primary')
      .should("exist")
      .click({ force: true });

    cy.get('[data-testid="continue-to-payment-button"]').click();
    // cy.get('.a5d86-items-baseline > .a5d86-bg-product-primary').should('be.visible').click()
    cy.get("body").then(($body) => {
      if (
        $body.find(".a5d86-items-baseline > .a5d86-bg-product-primary").length >
        0
      ) {
        cy.get(".a5d86-items-baseline > .a5d86-bg-product-primary")
          .should("be.visible")
          .click();
      } else {
        cy.log("The pop up is not present – skipping");
      }
    });
  }

  details() {
    cy.get('[data-component="mob-flight-slice-toggle-button"]').click()

    //expect price
    cy.get("@selectedPrice").then((selectedPrice) => {
      cy.get('[data-component="mob-flight-price-total-desc"]')
        .invoke("text")
        .should("include", selectedPrice);
    });

    //expect passenger details
    /// expect passenger full name
    cy.get("@fullName").then((fullName) => {
      cy.get('[data-component="name-container-name"]')
        .invoke("text")
        .should("include", fullName);
    });

    /// expecte passenger passport
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="review-passport-number"]').length > 0) {
        const storedPassport = Cypress.env("passengerPassport");
        cy.get('[data-testid="review-passport-number"]')
          .invoke("text")
          .should("include", storedPassport);
      } else {
        cy.log("Passport number tidak muncul di review page – skip check");
      }
    });

    //expected arrival time
    cy.get('@departureTime').then((departureTime) => {
      cy.get('[data-component="mob-flight-segment-departure"]').should('contain', departureTime);
    });
    
    cy.get('@arrivalTime').then((arrivalTime) => {
      cy.get('[data-component="mob-flight-segment-arrival"]').should('contain', arrivalTime);
    });
    
  }
}

export default new agodaBooking();
