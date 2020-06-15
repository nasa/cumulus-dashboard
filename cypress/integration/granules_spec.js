import { shouldBeRedirectedToLogin } from '../support/assertions';
import { DATEPICKER_DATECHANGE } from '../../app/src/js/actions/types';
import { msPerDay } from '../../app/src/js/utils/datepicker';

describe('Dashboard Granules Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/granules');
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

    it('should display a link to view granules', () => {
      cy.visit('/granules');
      cy.url().should('include', 'granules');
      cy.contains('.heading--xlarge', 'Granules');
      cy.contains('.heading--large', 'Granule Overview');

      // shows a summary count of completed and failed granules
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 7)
        .next().contains('li', 'Failed').contains('li', 2)
        .next().contains('li', 'Running').contains('li', 2);

      // shows a list of granules
      cy.getFakeApiFixture('granules').as('granulesListFixture');

      cy.get('@granulesListFixture').its('results')
        .each((granule) => {
          // Wait for this granule to appear before proceeding.
          cy.contains(granule.granuleId);
          cy.get(`[data-value="${granule.granuleId}"]`).children().as('columns');
          cy.get('@columns').should('have.length', 9);

          // Granule Status Column is correct
          cy.get('@columns').eq(1).invoke('text')
            .should('be.eq', granule.status.replace(/^\w/, c => c.toUpperCase()));
          // has link to the granule list with the same status
          cy.get('@columns').eq(1).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `/granules/${granule.status}`);

          // granule Name (id) column
          cy.get('@columns').eq(2).invoke('text')
            .should('be.eq', granule.granuleId);
          // has link to the detailed granule page
          cy.get('@columns').eq(2).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `/granules/granule/${granule.granuleId}`);

          // Published column, only public granules have CMR link
          if (granule.published) {
            cy.get('@columns').eq(3).invoke('text')
              .should('be.eq', 'Yes');
            cy.get('@columns').eq(3).children('a')
              .should('have.attr', 'href')
              .and('be.eq', granule.cmrLink);
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
            .and('be.eq', `/collections/collection/${granule.collectionId.replace('___', '/')}`);

          // has link to provider
          cy.get('@columns').eq(5).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `/providers/provider/${granule.provider}`);

          // Execution column has link to the detailed execution page
          cy.get('@columns').eq(6).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `/executions/execution/${granule.execution.split('/').pop()}`);

          // Duration column
          cy.get('@columns').eq(7).invoke('text')
            .should('be.eq', `${Number(granule.duration.toFixed(2))}s`);
          // Updated column
          cy.get('@columns').eq(8).invoke('text')
            .should('match', /.+ago$/);
        });

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 11);
    });

    it('should be able to sort table by granule name', () => {
      cy.visit('/granules');

      // save the names of the granules
      const originalGranuleNames = [];
      cy.get('.table .tbody .tr')
        .each(($row, index, $list) => {
          cy.wrap($row).children('.td').eq(2).invoke('text').then((name) =>
            originalGranuleNames.push(name));
        });

      cy.get('.table .thead .tr .th').contains('.table__sort', 'Name').click();
      cy.get('.table .thead .tr .th').contains('.table__sort--asc', 'Name');

      // wait until the names of the first two granules change
      cy.waitUntil(
        () => cy.get('.table .tbody .tr').eq(0).children('.td').eq(2).invoke('text')
          .then((name) => name !== originalGranuleNames[0]) ||
          cy.get('.table .tbody .tr').eq(1).children('.td').eq(2).invoke('text')
            .then((name) => name !== originalGranuleNames[1]),
        {
          timeout: 10000,
          interval: 500,
          errorMsg: 'granule name sorting not working within time limit'
        });

      const granuleNames = [];
      cy.get('.table .tbody .tr')
        .each(($row, index, $list) => {
          cy.wrap($row).children('.td').eq(2).invoke('text').then((name) =>
            granuleNames.push(name));
        })
        .then(() => {
          cy.wrap(granuleNames).should('have.length', 11);
          const actual = granuleNames.slice();
          cy.wrap(actual).should('deep.eq', granuleNames.sort());
        });
    });

    it('should display a link to download the granule list', () => {
      cy.visit('/granules');

      cy.contains('.heading--xlarge', 'Granules');

      cy.contains('a', 'Download Granule List');
    });

    it('Should update dropdown with label when visiting bookmarkable URL', () => {
      cy.visit('/granules?status=running');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('have.value', 'Running');

      cy.visit('/granules?status=completed');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('have.value', 'Completed');
    });

    it('Should update URL when dropdown filters are activated.', () => {
      cy.visit('/granules');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').click().type('fai').type('{enter}');
      cy.url().should('include', '?status=failed');
    });

    it('Should update URL and table when search filter is changed.', () => {
      const infix = 'A0142558';
      cy.visit('/granules');
      cy.get('.search').as('search');
      cy.get('@search').click().type(infix);
      cy.url().should('include', 'search=A0142558');
      cy.get('.table .tbody .tr').should('have.length', 1);
      cy.get('.table .tbody .tr').eq(0).children('.td').eq(2).contains(infix);
    });

    it('Should show Search and Dropdown filters in URL.', () => {
      cy.visit('/granules');
      cy.get('.search').as('search');
      cy.get('@search').should('be.visible').click().type('L2');
      cy.get('#form-Status-status > div > input').as('status-input');
      cy.get('@status-input').should('be.visible').click().type('comp{enter}');
      cy.url().should('include', 'search=L2').and('include', 'status=completed');
    });

    it.skip('should Update overview Tiles when datepicker state changes.', () => {
      // TODO Enable test when CUMULUS-1805 is completed
      cy.visit('/granules');
      cy.url().should('include', 'granules');
      cy.contains('.heading--xlarge', 'Granules');
      cy.contains('.heading--large', 'Granule Overview');

      // shows a summary count of completed and failed granules
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 7)
        .next().contains('li', 'Failed').contains('li', 2)
        .next().contains('li', 'Running').contains('li', 2);
      cy.window().its('appStore').then((store) => {
        store.dispatch({
          type: DATEPICKER_DATECHANGE,
          data: {
            startDateTime: new Date(Date.now() - 5 * msPerDay),
            endDateTime: new Date(Date.now() - 4 * msPerDay)
          }
        });
        cy.get('.overview-num__wrapper ul li')
          .first().contains('li', 'Completed').contains('li', 0)
          .next().contains('li', 'Failed').contains('li', 0)
          .next().contains('li', 'Running').contains('li', 0);
      });
    });

    it('Should update the table when the Results Per Page dropdown is changed.', () => {
      cy.visit('/granules');
      cy.get('.filter__item').eq(3).as('page-size-input');
      cy.get('@page-size-input').should('be.visible').click().type('10{enter}');
      cy.url().should('include', 'limit=10');
      cy.get('.table .tbody .tr').should('have.length', 10);
      cy.get('.pagination ol li')
        .first().contains('li', 'Previous')
        .next().contains('li', '1')
        .next().contains('li', '2');
    });

    it('Should reingest a granule and redirect to the granules detail page.', () => {
      const granuleId = 'MOD09GQ.A0142558.ee5lpE.006.5112577830916';
      cy.server();
      cy.route({
        method: 'PUT',
        url: '/granules/*',
        status: 200,
        response: { message: 'ingested' }
      });
      cy.visit('/granules');
      cy.get(`[data-value="${granuleId}"] > .td >input[type="checkbox"]`).click();
      cy.get('.list-actions').contains('Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert').should('contain.text', 'Success');
      cy.get('.button__goto').click();
      cy.url().should('include', `granules/granule/${granuleId}`);
      cy.get('.heading--large').should('have.text', granuleId);
    });

    it('Should reingest multiple granules and redirect to the running page.', () => {
      const granuleIds = [
        'MOD09GQ.A0142558.ee5lpE.006.5112577830916',
        'MOD09GQ.A9344328.K9yI3O.006.4625818663028'
      ];
      cy.server();
      cy.route({
        method: 'PUT',
        url: '/granules/*',
        status: 200,
        response: { message: 'ingested' }
      });
      cy.visit('/granules');
      cy.get(`[data-value="${granuleIds[0]}"] > .td >input[type="checkbox"]`).click();
      cy.get(`[data-value="${granuleIds[1]}"] > .td >input[type="checkbox"]`).click();
      cy.get('.list-actions').contains('Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert').should('contain.text', 'Success');
      cy.get('.button__goto').click();
      cy.url().should('include', 'granules/processing');
      cy.get('.heading--large').should('have.text', 'Running Granules 2');
    });

    it('Should fail to reingest multiple granules and remain on the page.', () => {
      const granuleIds = [
        'MOD09GQ.A0142558.ee5lpE.006.5112577830916',
        'MOD09GQ.A9344328.K9yI3O.006.4625818663028'
      ];
      cy.server();
      cy.route({
        method: 'PUT',
        url: '/granules/*',
        status: 500,
        response: { message: 'Oopsie' }
      });
      cy.visit('/granules');
      cy.get(`[data-value="${granuleIds[0]}"] > .td >input[type="checkbox"]`).click();
      cy.get(`[data-value="${granuleIds[1]}"] > .td >input[type="checkbox"]`).click();
      cy.get('.list-actions').contains('Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert').should('contain.text', 'Error');
      cy.get('.Collapsible__contentInner').should('contain.text', 'Oopsie');
      cy.get('.button--cancel').click();
      cy.url().should('match', /\/granules$/);
      cy.get('.heading--large').should('have.text', 'Granule Overview');
    });
  });
});
