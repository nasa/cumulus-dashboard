
describe('Dashboard Tests', () => {
  it('When not logged in it should redirect to login page', () => {
    cy.visit('http://localhost:3000');
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
});
