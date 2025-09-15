describe('Dashboard Sidebar', () => {
  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.visit('/');
    });

    it('should default to an open sidebar', () => {
      cy.visit('/collections');
      cy.get('.sidebar-toggle--wrapper').should('have.class', 'active');
      cy.get('.sidebar').should('be.visible');
    });

    it('should persist sidebar state across the app', () => {
      cy.visit('/collections');
      cy.get('.sidebar-toggle--wrapper').should('have.class', 'active');
      cy.get('.sidebar').should('be.visible');
      cy.get('.sidebar-toggle').should('have.class', 'button--close-sidebar').click();
      cy.get('.sidebar').should('not.be.visible');

      cy.get('.header nav li a[href="/granules"]').click();
      cy.get('.sidebar').should('not.be.visible');
      cy.get('.sidebar-toggle').should('have.class', 'button--open-sidebar').click();
      cy.get('.sidebar').should('be.visible');

      cy.get('.header nav li a[href="/executions"]').click();
      cy.get('.sidebar').should('be.visible');
    });
  });
});
