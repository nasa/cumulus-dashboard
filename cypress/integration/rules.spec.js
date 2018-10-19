import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Rules page', () => {
  it('when not logged in it should redirect to login page', () => {
    cy.visit('#/rules');
    shouldBeRedirectedToLogin();
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
      cy.visit('/');
      cy.get('nav').contains('Rules').click();
      cy.url().should('include', '/#/rules');
      cy.get('table tbody tr').should('have.length', 1);
      cy.get('table tr a')
        .contains('MOD09GQ_TEST_kinesisRule')
        .should('exist');
    });

    it.only('deleting a rule should remove it from the list', () => {
      cy.server();
      cy.route('DELETE', `${Cypress.env('APIROOT')}/rules/*`, {});

      cy.visit('/#/rules');
      cy.get('table tr[data-value="MOD09GQ_TEST_kinesisRule"] input[type="checkbox"')
        .should('exist')
        .click();
      cy.get('.form--controls button')
        .contains('Delete')
        .click();
      cy.get('.modal')
        .should('exist')
        .get('button')
        .contains('Confirm')
        .click();
      cy.get('table tbody tr').should('not.exist');
    });
  });
});
