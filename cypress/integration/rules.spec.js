describe('Rules page', () => {
  it('when not logged in it should redirect to login page', () => {
    cy.visit('#/rules');
    cy.url().should('include', '/#/auth');
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').should('have.attr', 'href').and('include', 'token?');
      cy.get('a').should('have.text', 'Login with Earthdata Login');
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should display a link to view rules', () => {
      cy.visit('/');
      cy.get('nav').contains('Rules').should('exist');
    });

    it('should display a list of rules', () => {
      cy.get('nav').contains('Rules').click();
      cy.url().should('include', '/#/rules');
      cy.get('table tbody tr').should('have.length', 1);
    });
  });
});
