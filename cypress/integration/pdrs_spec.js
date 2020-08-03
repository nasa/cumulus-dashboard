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
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').click().type('comp').type('{enter}');
      cy.url().should('include', '?status=completed');
      cy.get('.filter__item').eq(1).as('page-size-input');
      cy.get('@page-size-input').should('be.visible').click().type('10{enter}');
      cy.url().should('include', 'limit=10');

      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 4)
        .next().contains('li', 'Failed').contains('li', 0)
        .next().contains('li', 'Running').contains('li', 0);

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 4);
    });

    it('should display PDR details in the individual PDR page', () => {
      const pdrName = 'MOD09GQ_1granule_v3.PDR';
      cy.visit(`/pdrs/pdr/${pdrName}`);
      cy.contains('.heading--large', pdrName);
      cy.contains('.heading--medium', 'PDR Overview');

      cy.getFakeApiFixture('pdrs').its('results').then((pdrs) => {
        const pdr = pdrs.filter((item) => item.pdrName === pdrName)[0];
        cy.get('.metadata__details')
          .within(() => {
            cy.contains('Provider').next()
              .contains('a', pdr.provider)
              .should('have.attr', 'href', `/providers/provider/${pdr.provider}`);

            cy.contains('Collection').next()
              .contains('a', pdr.collectionId.split('___').join(' / '))
              .should('have.attr', 'href', `/collections/collection/${pdr.collectionId.split('___').join('/')}`);

            cy.contains('Execution').next()
              .contains('a', 'link')
              .should('have.attr', 'href', `/executions/execution/${pdr.execution.split('/').pop()}`);

            cy.contains('Status').next().contains(pdr.status, { matchCase: false });
            cy.contains('Duration').next().should('have.text', `${Number(pdr.duration.toFixed(2))}s`);
            cy.contains('PAN Sent').next().should('have.text', pdr.PANSent ? 'Yes' : 'No');
            cy.contains('PAN Message').next().should('have.text', pdr.PANmessage);
          });

        cy.contains('.heading--medium', 'Granules')
          .contains('.num-title', pdr.stats.total);

        cy.contains('.timeline--processing--running', 'Granules Running')
          .contains('.num--medium', pdr.stats.processing);
        cy.contains('.timeline--processing--completed', 'Granules Completed')
          .contains('.num--medium', pdr.stats.completed);
        cy.contains('.timeline--processing--failed', 'Granules Failed')
          .contains('.num--medium', pdr.stats.failed);
      });
    });

    it.only('should display granules in the individual PDR page', () => {
      const pdrName = 'MOD09GQ_1granule_v3.PDR';
      cy.visit(`/pdrs/pdr/${pdrName}`);
      cy.contains('.heading--large', pdrName);

      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').click().type('fai').type('{enter}');
      cy.url().should('include', '?status=failed');

      cy.get('@status-input').click().clear().type('comp').type('{enter}');
      cy.get('.search').as('search');
      cy.get('@search').eq(0).should('be.visible').click().type('GQ');
      cy.url().should('include', 'status=completed');
      cy.url().should('include', 'search=GQ');

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 1);
      cy.get('@list').eq(0).children().as('columns');

      cy.getFakeApiFixture('granules').its('results')
        .then((granules) => granules.filter((item) => item.pdrName === pdrName))
        .each((granule) => {
          cy.get(`[data-value="${granule.granuleId}"]`).children().as('columns');
          cy.get('@columns').eq(1)
            .contains(granule.status, { matchCase: false });
          cy.get('@columns').eq(2)
            .contains('a', granule.granuleId)
            .should('have.attr', 'href')
            .and('be.eq', `/granules/granule/${granule.granuleId}`);
          cy.get('@columns').eq(3)
            .contains('a', granule.collectionId.split('___').join(' / '))
            .should('have.attr', 'href', `/collections/collection/${granule.collectionId.split('___').join('/')}`);
          cy.get('@columns').eq(4)
            .should('have.text', `${Number(granule.duration.toFixed(2))}s`);
          cy.get('@columns').eq(5).invoke('text')
            .should('match', /.+ago$/);

          cy.get(`[data-value="${granule.granuleId}"] > .td >input[type="checkbox"]`).click();
          cy.get('.list-actions').contains('Delete').click();
          cy.get('.button--submit').click();
        });

      cy.url().should('include', `/pdrs/pdr/${pdrName}`);
      cy.get('.heading--large').should('have.text', pdrName);
    });
  });
});
