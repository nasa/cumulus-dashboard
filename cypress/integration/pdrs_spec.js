import { shouldBeRedirectedToLogin } from '../support/assertions';
import { collectionName, collectionHrefFromId } from '../../app/src/js/utils/format';

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
        .next()
        .contains('li', 'Failed')
        .contains('li', 2)
        .next()
        .contains('li', 'Running')
        .contains('li', 4);

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
            .should('match', /.+[0-9]{2}\/[0-9]{2}\/[0-9]{2}$/);
        });

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 10);
    });

    it('Should update URL when dropdown filters are changed', () => {
      cy.visit('/pdrs');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').click().type('comp').type('{enter}');
      cy.url().should('include', 'status=completed');

      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 4)
        .next()
        .contains('li', 'Failed')
        .contains('li', 0)
        .next()
        .contains('li', 'Running')
        .contains('li', 0);

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 4);
      cy.get('.table__header .filter-limit').as('limit-input');
      cy.get('@limit-input').should('be.visible').click().type('{backspace}{backspace}1{enter}');
      cy.url().should('include', 'limit=1');
      cy.get('.table__header .filter-page').as('page-input');
      cy.get('@page-input').should('be.visible').click().type('{backspace}2{enter}');
      cy.url().should('include', 'page=2');
      cy.get('.table .tbody .tr').should('have.length', 1);
    });

    it('should display active PDRs', () => {
      cy.visit('/pdrs');
      cy.contains('.sidebar__row ul li a', 'Running 4')
        .should('have.attr', 'href', '/pdrs/active')
        .click();

      cy.contains('.heading--xlarge', 'Pdrs');
      cy.contains('.heading--large', 'Active PDRs')
        .contains('.num-title', 4);

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 4);

      cy.get('.search').as('search');
      cy.get('@search').eq(0).should('be.visible').click()
        .type('A03861');
      cy.url().should('include', 'search=A0386');

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 1);
    });

    it('should display completed PDRs', () => {
      cy.visit('/pdrs/completed');
      cy.contains('.heading--xlarge', 'Pdrs');
      cy.contains('.heading--large', 'Completed PDRs')
        .contains('.num-title', 4);

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 4);
    });

    it('should display failed PDRs', () => {
      cy.visit('/pdrs');
      cy.contains('.sidebar__row ul li a', 'Failed 2')
        .should('have.attr', 'href', '/pdrs/failed')
        .click();
      cy.contains('.heading--xlarge', 'Pdrs');
      cy.contains('.heading--large', 'Failed PDRs')
        .contains('.num-title', 2);

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 2);

      cy.get('.search').as('search');
      cy.get('@search').eq(0).should('be.visible').click()
        .type('9272');
      cy.url().should('include', 'search=9272');

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 1);
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
              .contains('a', collectionName(pdr.collectionId))
              .should('have.attr', 'href', collectionHrefFromId(pdr.collectionId));

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

    it('should display granules in the individual PDR page', () => {
      const pdrName = 'MOD09GQ_1granule_v3.PDR';
      cy.visit(`/pdrs/pdr/${pdrName}`);
      cy.contains('.heading--large', pdrName);

      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').click().type('fai').type('{enter}');
      cy.url().should('include', 'status=failed');

      cy.get('@status-input').click().clear().type('comp')
        .type('{enter}');
      cy.get('.search').as('search');
      cy.get('@search').eq(0).should('be.visible').click()
        .type('GQ');
      cy.url().should('include', 'status=completed');
      cy.url().should('include', 'search=GQ');

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 2);

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
            .contains('a', collectionName(granule.collectionId))
            .should('have.attr', 'href', collectionHrefFromId(granule.collectionId));
          cy.get('@columns').eq(4)
            .should('have.text', `${Number(granule.duration.toFixed(2))}s`);
          cy.get('@columns').eq(5).invoke('text')
            .should('match', /.+[0-9]{2}\/[0-9]{2}\/[0-9]{2}$/);
          cy.intercept('DELETE', `/granules/${granule.granuleId}`).as(`deleteGranule${granule.granuleId}`);
          cy.get(`[data-value="${granule.granuleId}"] > .td >input[type="checkbox"]`).check();
          cy.get('.list-actions').contains('Delete').click();
          cy.get('.button--submit').click();
          cy.wait(`@deleteGranule${granule.granuleId}`);
          cy.get('.button--cancel').click();
        });

      cy.url().should('include', `/pdrs/pdr/${pdrName}`);
      cy.get('.heading--large').should('have.text', `PDR: ${pdrName}`);
    });

    it('Should dynamically update menu, sidbar and breadcrumb /pdrs links with latest filter criteria', () => {
      const status = 'running';

      cy.visit('/pdrs');

      cy.get('#status').as('status-input');
      cy.get('@status-input').click().type(status).type('{enter}');

      cy.get('.table__main-asset > a').first().click({ force: true });

      // Menu <Link>s contain correct query params
      cy.get('nav > ul > :nth-child(8) > a')
        .should('have.attr', 'href')
        .and('include', `status=${status}`);

      // Sidebar <Link>s contain correct query params
      cy.get('.sidebar__nav--back')
        .should('have.attr', 'href')
        .and('include', `status=${status}`);
    });
  });
});
