import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Rules page', () => {
  it('when not logged in it should redirect to login page', () => {
    cy.visit('#/rules');
    shouldBeRedirectedToLogin();
  });

  describe('when logged in', () => {
    const testProvider = 'PODAAC_SWOT';
    const testCollection = 'MOD09GQ / 006';

    beforeEach(() => {
      cy.login();
    });

    it('should display a link to view rules', () => {
      cy.visit('/');
      cy.get('nav').contains('Rules').should('exist');
    });

    it('should display a list of rules', () => {
      cy.visit('/');
      cy.get('nav').contains('Rules').click();
      cy.url().should('include', '/#/rules');
      cy.get('table tbody tr').should('have.length', 1);
      cy.get('table tr[data-value="MOD09GQ_TEST_kinesisRule"]')
        .should('exist')
        .within(() => {
          cy.contains(testProvider).should('exist');
          cy.contains(testCollection).should('exist');
        });
    });
  });
});
