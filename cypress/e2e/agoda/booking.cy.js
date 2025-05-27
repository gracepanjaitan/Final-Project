import agodaBooking from "../../support/page-objects/agoda/booking";

describe("Booking ticket on Agoda", () => {
  beforeEach(function(){
    cy.fixture('bookingFlight').as('data');
  });

  it("Booking", function() {
    agodaBooking.visit(Cypress.env("agodaUrl"));
    // cy.wait(10000)
    agodaBooking.getFlightForm();
    agodaBooking.getFlyingFromCode(this.data.flyingFrom, this.data.fromCode);
    agodaBooking.getFlyingToCode(this.data.flyingTo, this.data.toCode);
    agodaBooking.selectDepartureDate()
    agodaBooking.sendForm();
    agodaBooking.filter(); 
    agodaBooking.sortbyDepartureTime()
    agodaBooking.selectFlightSchedule()
    agodaBooking.contactDetailsForm()
    agodaBooking.passengersForm()
    agodaBooking.payment()
  });
});
