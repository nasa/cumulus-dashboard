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

    it('should have a download button column', () => {
      cy.visit('/reconciliation-reports');
      cy.get('.button__row--download').should('have.length', 3);
    });

    it('deletes a report when the Delete button is clicked', () => {
      cy.visit('/reconciliation-reports');
      cy.get('[data-value="inventoryReport-20200114T202529026"] > .td .button__row--delete').click();

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
          count: 216,
          firstColumn: 'Filename'
        },
        {
          title: 'Cumulus',
          count: 21,
          firstColumn: 'Collection name'
        },
        {
          title: 'CMR',
          count: 391,
          firstColumn: 'Collection name'
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
      cy.get('.multicard > :nth-child(2)')
        .within(() => {
          cy.get('.card-header').click();
          cy.contains('.table__filters .button__filter', 'Show Column Filters').click();
          cy.get('.table__filters--collapse').should('be.visible');
          const filterLabel = 'Collection name';

          cy.contains('.table .th', filterLabel).should('be.visible');
          cy.contains('.table__filters--filter label', filterLabel).prev().click();
          cy.contains('.table .th', filterLabel).should('not.be.visible');

          cy.get('.table__filters .button__filter').click();
          cy.contains('.table__filters .button__filter', 'Show Column Filters');
          cy.get('.table__filters--collapse').should('not.be.visible');
        });
    });

    it('Has a way to expand/collapse all tables', () => {
      cy.visit('/reconciliation-reports/report/inventoryReport-20200114T205238781');
      cy.get('.multicard__header').should('exist');
      cy.get('.multicard__header--expanded').should('not.exist');
      cy.get('.link').should('contain', 'Expand All').click();

      cy.get('.multicard__header--expanded').should('exist');
      cy.get('.link').should('contain', 'Collapse All');

      cy.get('.multicard__header').click();
      cy.get('.link').should('contain', 'Expand All');
      cy.get('.multicard__header--expanded').should('not.exist');
    });

    it('should have download option for full report and individual tables', () => {
      cy.visit('/reconciliation-reports/report/inventoryReport-20200114T205238781');

      cy.contains('.card-header', 'Cumulus').click();
      cy.get('#download-report-dropdown').click();
      cy.get('.dropdown-item').should('have.length', 4);
      cy.get('.dropdown-item').eq(0).should('contain', 'JSON - Full Report');
      cy.get('.dropdown-item').eq(1).should('contain', 'CSV - Collections only in Cumulus');
      cy.get('.dropdown-item').eq(2).should('contain', 'CSV - Granules only in Cumulus');
      cy.get('.dropdown-item').eq(3).should('contain', 'CSV - Files only in Cumulus');
    });

    it('should include legend on list page', () => {
      cy.visit('/reconciliation-reports');

      cy.get('.legend').should('have.length', 1);
      cy.get('.legend-items--item').should('have.length', 3);
      cy.get('.legend-items--item').eq(0).should('contain', 'Granule not found');
      cy.get('.legend-items--item').eq(1).should('contain', 'Missing image file');
      cy.get('.legend-items--item').eq(2).should('contain', 'No issues/conflicts');
    });
  });
});
