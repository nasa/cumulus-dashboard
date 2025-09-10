exports.shouldBeLoggedIn = () => {
  cy.get('h1[class=heading--xlarge').should('have.text', 'CUMULUS Dashboard');
};

exports.shouldBeRedirectedToLogin = () => {
  cy.url().should('include', '/auth');
  cy.get('div[class=modal-content]')
    .filter(':has(.oauth-modal__header)')
    .within(() => {
      cy.get('a').should('have.attr', 'href').and('include', 'token?');
      cy.get('a').should('have.text', 'Login with Earthdata Login');
    });
};

exports.shouldHaveNoToken = () => {
  cy.wrap(Cypress.env('authToken')).should('be.null');
  
  // Assert local storage is null
  cy.window().its('localStorage').invoke('getItem', 'auth-token').should('be.null');
};

exports.shouldHaveDeletedToken = () => {
  cy.wrap(Cypress.env('authToken')).should('eq', '');

  // Assert local storage is an empty string
  cy.window().its('localStorage').invoke('getItem', 'auth-token').should('eq', '');
};
