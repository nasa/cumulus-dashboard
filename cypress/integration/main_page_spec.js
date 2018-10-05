describe('Dashboard Tests', () => {
  const host = process.env.DASHBOARD_HOST || 'http://localhost:3000/';
  it('When not logged in it should redirect to login page', () => {
    cy.visit(host);
    cy.url().should('include', '/#/auth');
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').should('have.attr', 'href').and('include', 'token?');
      cy.get('a').should('have.text', 'Login with Earthdata Login');
    });
  });

  it('Logging in successfully redirects to the Dashboard main page', () => {
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').click();
    });

    cy.get('h1[class=heading--xlarge').should('have.text', 'CUMULUS Dashboard');
    cy.get('li[class=nav__order-0]').within(() => {
      cy.get('a').should('have.attr', 'href').and('include', '/collections');
    });
  });

  it('Logging out successfully redirects to the login screen', () => {
    cy.visit(host);
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').click();
    });

    cy.get('h1[class=heading--xlarge').should('have.text', 'CUMULUS Dashboard');

    cy.request('/#/collections');

    cy.get('nav li').last().within(() => {
      cy.get('a').should('have.text', 'Log out');
    });
    cy.get('nav li').last().click();

    cy.url().should('include', '/#/auth');
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').should('have.attr', 'href').and('include', 'token?');
      cy.get('a').should('have.text', 'Login with Earthdata Login');
    });
  });
});
