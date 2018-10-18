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
    before(() => {
      cy.login();
      cy.visit('#/rules');
    });

    it('should display a list of rules', () => {
      cy.get('table tbody tr').should('have.length', 1);
    });
  });
});
