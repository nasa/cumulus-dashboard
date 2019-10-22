import { shouldBeRedirectedToLogin } from '../support/assertions';

function visitGranulePage () {
  cy.visit('/');
  cy.contains('nav li a', 'Granules').as('granules');
  cy.get('@granules').should('have.attr', 'href', '#/granules');
  cy.get('@granules').click();
}

describe('Dashboard Granules Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/granules');
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

    it('should display a link to view granules', () => {
      visitGranulePage();
      cy.url().should('include', 'granules');
      cy.contains('.heading--xlarge', 'Granules');
      cy.contains('.heading--large', 'Granule Overview');

      // shows a summary count of completed and failed granules
      cy.get('.overview-num__wrapper ul li')
        .first()
        .contains('li', '243 Completed')
        .next()
        .contains('li', '32 Failed')
        .next()
        .contains('li', '14 Running');

      // shows a list of granules
      cy.getFakeApiFixture('granules').as('granulesList');

      cy.get('table tbody tr').as('list');
      cy.get('@list').its('length').should('be.eq', 10);

      // compare data in each row with the data from fixture
      cy.get('@list').each(($el, index) => {
        // columns in the row
        cy.wrap($el).children().as('columns');
        cy.get('@columns').its('length').should('be.eq', 8);

        cy.get('@granulesList').its('results').then((granules) => {
          const granule = granules[index];

          // granule Status column
          cy.get('@columns').eq(1).invoke('text')
            .should('be.eq', granule.status.replace(/^\w/, c => c.toUpperCase()));
          // has link to the granule list with the same status
          cy.get('@columns').eq(1).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `#/granules/${granule.status}`);

          // granule Name (id) column
          cy.get('@columns').eq(2).invoke('text')
            .should('be.eq', granule.granuleId);
          // has link to the detailed granule page
          cy.get('@columns').eq(2).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `#/granules/granule/${granule.granuleId}`);

          // Published column, only public granules have CMR link
          if (granule.published) {
            cy.get('@columns').eq(3).invoke('text')
              .should('be.eq', 'Yes');
            cy.get('@columns').eq(3).children('a')
              .should('have.attr', 'href')
              .and('include', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=');
          } else {
            cy.get('@columns').eq(3).invoke('text')
              .should('be.eq', 'No');
            cy.get('@columns').eq(3).children('a')
              .should('not.exist');
          }

          // Collection ID column
          cy.get('@columns').eq(4).invoke('text')
            .should('be.eq', granule.collectionId.replace('___', ' / '));
          // has link to the detailed collection page
          cy.get('@columns').eq(4).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `#/collections/collection/${granule.collectionId.replace('___', '/')}`);

          // Execution column has link to the detailed execution page
          cy.get('@columns').eq(5).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `#/executions/execution/${granule.execution.split('/').pop()}`);

          // Duration column
          cy.get('@columns').eq(6).invoke('text')
            .should('be.eq', `${Number(granule.duration.toFixed(2))}s`);
          // Updated column
          cy.get('@columns').eq(7).invoke('text')
            .should('match', /.+ago$/);
        });
      });
    });

    it('should display a link to download the granule list', () => {
      visitGranulePage();

      cy.contains('.heading--xlarge', 'Granules');

      cy.contains('a', 'Download Granule List')
      .should('have.attr', 'href').should('include', 'blob:http://');
    });

    it('Should update dropdown with label when visiting bookmarkable URL', () => {
      cy.visit('/#/granules?status=running');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('have.value', 'Running');

      cy.visit('/#/granules?status=completed');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('have.value', 'Completed');
    });

    it('Should update dropdown with status value if query params are not a valid status.', () => {
      cy.visit('/#/granules?status=notanoption');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('have.value', 'notanoption');
    });

    it('Should update URL when dropdown filters are activated.', () => {
      visitGranulePage();
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').click().type('fai').type('{enter}');
      cy.url().should('include', '?status=failed');
    });

    it('Should update URL when search filter is changed.', () => {
      visitGranulePage();
      cy.get('.search').as('search');
      cy.get('@search').click().type('L2');
      cy.url().should('include', 'search=L2');
    });

    it('Should show Search and Dropdown filters in URL.', () => {
      visitGranulePage();
      cy.get('.search').as('search');
      cy.get('@search').click().type('L2');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').click().type('comp{enter}');
      cy.url().should('include', 'search=L2').and('include', 'status=completed');
    });
  });
});
