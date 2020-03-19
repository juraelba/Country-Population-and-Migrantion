const ROUTES = [
  {
    aliasName: "getAgencies",
    url: "/FusionRegistry/ws/public/sdmxapi/rest/agencyscheme/**"
  },
  {
    aliasName: "getCategories",
    url: "/FusionRegistry/ws/public/sdmxapi/rest/categoryscheme/**"
  },
  {
    aliasName: "getDataflows",
    url: "/FusionRegistry/ws/public/sdmxapi/rest/dataflow/**"
  }
];

before(() => {
  cy.server();
  ROUTES.forEach(route => {
    cy.route(route.url).as(route.aliasName);
  });
});

describe("Home page", () => {
  it("automatically selects the first option of blocks in the sidebar", () => {
    cy.visit("/");

    cy.wait("@getAgencies");
    cy.wait("@getCategories");
    cy.wait("@getDataflows");
    cy.get(".data-providers [type='checkbox']:first").should("be.checked");
    cy.get(".statistical-domains [type='checkbox']:first").should("be.checked");
    cy.get(".datasets [type='checkbox']:first").should("be.checked");
  });
});
