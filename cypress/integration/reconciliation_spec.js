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
      cy.get('.table .tbody .tr').should('have.length', 3);
      cy.get('[data-value="inventoryReport-20200114T202529026"] > .table__main-asset > a').should('have.attr', 'href', '/reconciliation-reports/report/inventoryReport-20200114T202529026');
      cy.get('[data-value="inventoryReport-20200114T205238781"] > .table__main-asset > a').should('have.attr', 'href', '/reconciliation-reports/report/inventoryReport-20200114T205238781');
    });

    it('should update dropdown with label when visiting bookmarkable URL', () => {
      cy.visit('/reconciliation-reports?status=Generated');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('have.value', 'Generated');

      cy.visit('/reconciliation-reports?type=Inventory');
      cy.get('#form-Report\\ Type-type > div > input').as('type-input');
      cy.get('@type-input').should('have.value', 'Inventory');
    });

    it('should show Search and Dropdown filters in URL', () => {
      cy.visit('/reconciliation-reports');
      cy.get('.search').as('search');
      cy.get('@search').should('be.visible').click().type('inventoryReport-2020');

      cy.get('#form-Report\\ Type-type > div > input').as('type-input');
      cy.get('@type-input').should('be.visible').click().type('invent{enter}');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('be.visible').click().type('gener{enter}');
      cy.url().should('include', 'search=inventoryReport-2020')
        .and('include', 'type=Inventory')
        .and('include', 'status=Generated');
      cy.get('.table .tbody .tr').should('have.length', 2);
    });

    it('deletes a report when the Delete button is clicked', () => {
      cy.visit('/reconciliation-reports');
      cy.get('[data-value="inventoryReport-20200114T202529026"] > .td')
        .eq(5)
        .find('button')
        .click();

      cy.get('.table .tbody .tr').should('have.length', 2);
      cy.get('[data-value="inventoryReport-20200114T202529026"]')
        .should('not.exist');
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

      /** Table Filters **/
      cy.get('.table__filters');
      cy.contains('.table__filters .button__filter', 'Hide Column Filters');
      cy.get('.table__filters--collapse').should('be.visible');

      const filterLabel = 'GranuleId';

      cy.contains('.table .th', filterLabel).should('be.visible');
      cy.contains('.table__filters--filter label', filterLabel).prev().click();
      cy.contains('.table .th', filterLabel).should('not.be.visible');

      cy.get('.table__filters .button__filter').click();
      cy.contains('.table__filters .button__filter', 'Show Column Filters');
      cy.get('.table__filters--collapse').should('not.be.visible');
    });
  });
});
