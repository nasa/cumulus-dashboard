import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard PDRs Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/pdrs');
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
    });

    it('should display all the PDRs', () => {
      cy.visit('/pdrs');
      cy.url().should('include', 'pdrs');
      cy.contains('.heading--xlarge', 'Pdrs');
      cy.contains('.heading--large', 'PDR Overview');

      // shows a summary count of completed and failed pdrs
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 4)
        .next().contains('li', 'Failed').contains('li', 2)
        .next().contains('li', 'Running').contains('li', 4);

      // shows a list of PDRs
      cy.getFakeApiFixture('pdrs').as('pdrsListFixture');

      cy.get('@pdrsListFixture').its('results')
        .each((pdr) => {
          // Wait for this pdr to appear before proceeding
          cy.contains(pdr.pdrName);
          cy.get(`[data-value="${pdr.pdrName}"]`).children().as('columns');
          cy.get('@columns').should('have.length', 7);

          // Has PDR name column
          cy.get('@columns').eq(1).invoke('text')
            .should('be.eq', pdr.pdrName);
          // has link to the detailed PDR page
          cy.get('@columns').eq(1).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `/pdrs/pdr/${pdr.pdrName}`);

          // Has PDR status
          cy.get('@columns').eq(2).invoke('text')
            .should('be.eq', pdr.status);

          // Discovered Column
          cy.get('@columns').eq(6).invoke('text')
            .should('match', /.+ago$/);
        });

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 10);
    });

    it('Should update URL when dropdown filters are changed', () => {
      cy.visit('/pdrs');
      cy.get('.filter__item').eq(1).as('page-size-input');
      cy.get('@page-size-input').should('be.visible').click().type('10{enter}');
      cy.url().should('include', 'limit=10');
    });
  });
});
