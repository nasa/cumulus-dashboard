import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Executions Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/executions');
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

    it('should display a link to view executions', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href', '#/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      cy.contains('.heading--large', 'Execution Overview');

      // shows a summary count of completed and failed executions
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', '3 Completed')
        .next().contains('li', '1 Failed')
        .next().contains('li', '1 Running');

      // shows a list of executions with IDs and status
      cy.get('table tbody tr').as('list');
      cy.get('@list').its('length').should('be.eq', 5);
      cy.get('@list').each(($el, index, $list) => {
        cy.wrap($el).children().as('children');
        cy.get('@children').its('length').should('be.eq', 6);
        cy.get('@children').eq(0).children('a').should('have.attr', 'href');
        cy.get('@children').eq(1).invoke('text').should('match', /(Completed|Failed|Running)/);
        cy.get('@children').eq(2).invoke('text').should('match', /.+/);
        cy.get('@children').eq(3).invoke('text').should('match', /.+ago$/);
        cy.get('@children').eq(4).invoke('text').should('match', /.+s$/);
      });
    });

    it('should show a single execution', () => {
      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href', '#/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      const executionName = '50eaad71-bba8-4376-83d7-bb9cc1309b92';

      cy.get('table tbody tr').within(() => {
        cy.get(`a[title=${executionName}]`).click();
      });

      cy.contains('.heading--large', 'Execution');
      cy.contains('.heading--medium', 'Visual workflow');
    });
  });
});
