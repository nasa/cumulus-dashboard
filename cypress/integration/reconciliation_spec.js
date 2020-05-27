import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Reconciliation Reports Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/reconciliation-reports');
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.visit('/');
    });

    it('displays a link to view reconciliation reports', () => {
      cy.contains('nav li a', 'Reconciliation Reports').as('reconciliationReports');
      cy.get('@reconciliationReports').should('have.attr', 'href', '/reconciliation-reports');
      cy.get('@reconciliationReports').click({ force: true });

      cy.url().should('include', 'reconciliation-reports');
      cy.contains('.heading--large', 'Reconciliation Reports Overview');
    });

    it('displays a list of reconciliation reports', () => {
      cy.visit('/reconciliation-reports');

      cy.contains('.table .thead .th', 'Name');
      cy.contains('.table .thead .th', 'Report Type');
      cy.contains('.table .thead .th', 'Status');
      cy.contains('.table .thead .th', 'Date Generated');
      cy.contains('.table .thead .th', 'Download Report');
      cy.contains('.table .thead .th', 'Delete Report');
      cy.get('.table .tbody .tr').should('have.length', 2);
      cy.get('[data-value="inventoryReport-20200114T202529026"] > .table__main-asset > a').should('have.attr', 'href', '/reconciliation-reports/report/inventoryReport-20200114T202529026');
      cy.get('[data-value="inventoryReport-20200114T205238781"] > .table__main-asset > a').should('have.attr', 'href', '/reconciliation-reports/report/inventoryReport-20200114T205238781');
    });

    it('displays a link to an individual report', () => {
      cy.visit('/reconciliation-reports');

      cy.contains('.table .tbody .tr a', 'inventoryReport-20200114T205238781')
        .should('have.attr', 'href', '/reconciliation-reports/report/inventoryReport-20200114T205238781')
        .click();

      cy.contains('.heading--large', 'inventoryReport-20200114T205238781');

      /** Table Cards **/

      const cards = [
        {
          title: 'DynamoDB',
          count: 35,
          firstColumn: 'GranuleId'
        },
        {
          title: 'S3',
          count: 16,
          firstColumn: 'Filename'
        },
        {
          title: 'Cumulus Collections',
          count: 13,
          firstColumn: 'Collection name'
        },
        {
          title: 'CMR Collections',
          count: 25,
          firstColumn: 'Collection name'
        },
        {
          title: 'Cumulus Granules',
          count: 7,
          firstColumn: 'Granule ID'
        },
        {
          title: 'CMR Granules',
          count: 365,
          firstColumn: 'Granule ID'
        },
        {
          title: 'Cumulus Only Granules',
          count: 1,
          firstColumn: 'GranuleId'
        },
        {
          title: 'CMR Only Granules',
          count: 1,
          firstColumn: 'GranuleId'
        }
      ];

      cy.get('.card').each(($card, index, $cards) => {
        const card = cy.wrap($card);
        card.click();
        card.should('have.class', 'active');
        card.get('.card-header').contains(cards[index].title);
        card.get('.card-title').contains(cards[index].count);

        // verify correct table is displayed on click
        cy.get('.table .th').first().contains(cards[index].firstColumn);
      });
    });
  });
});
