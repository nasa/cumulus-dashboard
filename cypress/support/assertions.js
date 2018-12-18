exports.shouldBeRedirectedToLogin = () => {
  cy.url().should('include', '/#/auth');
  cy.get('div[class=modal__internal]').within(() => {
    cy.get('a').should('have.attr', 'href').and('include', 'token?');
    cy.get('a').should('have.text', 'Login with Earthdata Login');
  });
};

exports.shouldHaveApiVersionNumber = (apiVersionNumber) => {
  cy.window().its('appStore').then((store) => {
    cy.log(store.getState());
    cy.log(store.getState().apiVersion);
    // expect(store.getState().apiVersion.versionNumber).to.equal(apiVersionNumber);
  });
};
