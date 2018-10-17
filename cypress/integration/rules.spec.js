describe('Rules page', () => {
  const host = process.env.DASHBOARD_HOST || 'http://localhost:3000/';
  it('When not logged in it should redirect to login page', () => {
    cy.visit(`${host}#/rules`);
    cy.url().should('include', '/#/auth');
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').should('have.attr', 'href').and('include', 'token?');
      cy.get('a').should('have.text', 'Login with Earthdata Login');
    });
  });

  it('Logging in successfully redirects to the Dashboard main page', () => {
    cy.login();
    cy.contains('Rules').should('have.attr', 'href').and('include', '/rules');
  });
});
