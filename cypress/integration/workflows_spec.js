import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Workflows Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/workflows');
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login();
      cy.task('resetState');
    });

    after(() => {
      cy.task('resetState');
    });

    it('displays a link to view workflows', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Workflows').as('workflows');
      cy.get('@workflows').should('have.attr', 'href', '#/workflows');
      cy.get('@workflows').click();

      cy.url().should('include', 'workflows');
      cy.contains('.heading--xlarge', 'Workflows');

      cy.get('table tbody tr').its('length').should('be.eq', 3);
    });
  });
});
