import { shouldBeRedirectedToLogin } from '../support/assertions';

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

    it('should display all granules in table with correct columns', () => {
      cy.visit('/granules');
      cy.url().should('include', 'granules');
      cy.contains('.heading--xlarge', 'Granules');
      cy.contains('.heading--large', 'Granule Overview');

      // shows a summary count of completed and failed granules
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 7)
        .next()
        .contains('li', 'Failed')
        .contains('li', 2)
        .next()
        .contains('li', 'Running')
        .contains('li', 2);

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
            .should('be.eq', granule.status.replace(/^\w/, (c) => c.toUpperCase()));
          // has link to the granule list with the same status
          cy.get('@columns').eq(1).children('a')
            .should('have.attr', 'href')
            .and('be.eq', `/granules/${granule.status}`);

          // granule Name (id) column
          cy.get('@columns').eq(2).invoke('text')
            .should('be.eq', granule.granuleId);
          // has link to the detailed granule page
          cy.get('@columns').eq(2).find('a')
            .should('have.attr', 'href')
            .and('be.eq', `/granules/granule/${granule.granuleId}`);
          // has popover with copy feature
          cy.get('@columns').eq(2).find('.hover-wrap').trigger('mouseover');
          cy.get(`#granuleId-${granule.granuleId.replaceAll('.', '\\.')}-popover`).as('popover');
          cy.get('@popover').should('be.visible');
          cy.get('@popover').contains('.popover-body--main', granule.granuleId);
          cy.get('@popover').contains('button', 'Copy').click();
          cy.get('@popover').find('span').should('be.visible');
          cy.get('@columns').eq(2).find('.hover-wrap').trigger('mouseleave');

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
          const formattedCollectionId = granule.collectionId.replace('___', ' / ');
          cy.get('@columns').eq(4).invoke('text')
            .should('be.eq', formattedCollectionId);
          // has popover with copy feature
          cy.get('@columns').eq(4).find('.hover-wrap').trigger('mouseover');
          cy.get(`#collectionId-${granule.collectionId}-popover`).as('popover');
          cy.get('@popover').should('be.visible');
          cy.get('@popover').contains('.popover-body--main', formattedCollectionId);
          cy.get('@popover').contains('button', 'Copy').click();
          cy.get('@popover').find('span').should('be.visible');
          cy.get('@columns').eq(2).find('.hover-wrap').trigger('mouseleave');

          // has link to the detailed collection page
          cy.get('@columns').eq(4).find('a')
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
            .should('be.eq', `${Number(granule.duration).toFixed(2)}s`);
          // Updated column
          cy.get('@columns').eq(8).invoke('text')
            .should('match', /.+ago$/);
          cy.get('@columns').eq(8).find('span').trigger('mouseover');
          cy.get('#table-timestamp-tooltip').should('be.visible');
          cy.get('@columns').eq(8).find('span').trigger('mouseleave');
        });

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 11);
    });

    it('should be able to sort table by multiple fields', () => {
      cy.visit('/granules');

      cy.get('.table .thead .tr .th').contains('.table__sort', 'Collection ID').dblclick();
      cy.get('.table .thead .tr .th').contains('.table__sort--desc', 'Collection ID');
      cy.get('.table .thead .tr .th').contains('.table__sort', 'Status').click({ shiftKey: true });
      cy.get('.table .thead .tr .th').contains('.table__sort--asc', 'Status');
      cy.get('.table .thead .tr .th').contains('.table__sort', 'Name').click({ shiftKey: true });
      cy.get('.table .thead .tr .th').contains('.table__sort--asc', 'Name');

      // wait until the selected fields of granules are in sorted order
      cy.waitUntil(
        () => {
          const granules = [];
          return cy.get('.table .tbody .tr')
            .each(($row, index, $list) => {
              const granule = {};
              cy.wrap($row).children('.td').eq(4).invoke('text')
                .then((collectionId) => (granule.collectionId = collectionId));
              cy.wrap($row).children('.td').eq(1).invoke('text')
                .then((status) => (granule.status = status));
              cy.wrap($row).children('.td').eq(2).invoke('text')
                .then((name) => (granule.name = name));
              granules.push(granule);
            })
            .then(() => (
              granules.length === 11 &&
              Cypress._.isEqual(granules, Cypress._.orderBy(granules, ['collectionId', 'status', 'name'], ['desc', 'asc', 'asc']))
            ));
        },
        {
          timeout: 10000,
          interval: 1000,
          errorMsg: 'granule multi-column sorting not working within time limit'
        }
      );
    });

    it('Should resize column to fit content on double click', () => {
      cy.visit('/granules');
      cy.contains('.table .thead .tr .th', 'Name').as('nameColumn');
      cy.get('@nameColumn').invoke('outerWidth').should('eq', 225);
      cy.get('@nameColumn').find('.resizer').dblclick();
      cy.get('@nameColumn').invoke('outerWidth').should('eq', 400);
    });

    it('Should update dropdown with label when visiting bookmarkable URL', () => {
      cy.visit('/granules?status=running');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('have.value', 'Running');

      cy.visit('/granules?status=completed');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('have.value', 'Completed');
    });

    it('Should update overview metrics when visiting bookmarkable URL', () => {
      cy.visit('/granules?status=running');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('have.value', 'Running');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 0).and('contain', 'Completed')
          .next()
          .should('contain', 0)
          .and('contain', 'Failed')
          .next()
          .should('contain', 2)
          .and('contain', 'Running');
      });

      cy.visit('/granules?status=completed');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('have.value', 'Completed');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 7).and('contain', 'Completed')
          .next()
          .should('contain', 0)
          .and('contain', 'Failed')
          .next()
          .should('contain', 0)
          .and('contain', 'Running');
      });
    });

    it('Should update URL and overview section when dropdown filters are activated.', () => {
      cy.visit('/granules');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').click().type('fai').type('{enter}');
      cy.url().should('include', 'status=failed');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 0).and('contain', 'Completed')
          .next()
          .should('contain', 2)
          .and('contain', 'Failed')
          .next()
          .should('contain', 0)
          .and('contain', 'Running');
      });
    });

    it('Should update URL and table when search filter is changed.', () => {
      const infix = 'A0142558';
      cy.visit('/granules');
      cy.get('.search').as('search');
      cy.get('@search').click().type(infix);
      cy.url().should('include', `search=${infix}`);
      cy.get('.table .tbody .tr').should('have.length', 1);
      cy.get('.table .tbody .tr').eq(0).children('.td').eq(2)
        .contains(infix);
    });

    it('Should show Search and Dropdown filters in URL.', () => {
      cy.visit('/granules');
      cy.get('.search').as('search');
      cy.get('@search').should('be.visible').click().type('L2');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('be.visible').click({ force: true }).type('comp{enter}');
      cy.url().should('include', 'search=L2').and('include', 'status=completed');
    });

    it('Should add datetime to sidebar link but no other filters', () => {
      cy.visit('/granules');
      cy.setDatepickerDropdown('Recent');
      cy.get('.search').as('search');
      cy.get('@search').should('be.visible').click().type('L2');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('be.visible').click({ force: true }).type('comp{enter}');
      cy.contains('.sidebar__row ul li a', 'Running').should('have.attr', 'href').and('match', /startDateTime/).and('not.match', /search|status/);
    });

    it('should Update overview Tiles when datepicker state changes.', () => {
      cy.visit('/granules');
      cy.url().should('include', 'granules');
      cy.contains('.heading--xlarge', 'Granules');
      cy.contains('.heading--large', 'Granule Overview');

      // shows a summary count of completed and failed granules
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 7)
        .next()
        .contains('li', 'Failed')
        .contains('li', 2)
        .next()
        .contains('li', 'Running')
        .contains('li', 2);
      cy.setDatepickerDropdown('Recent');
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 7)
        .next()
        .contains('li', 'Failed')
        .contains('li', 2)
        .next()
        .contains('li', 'Running')
        .contains('li', 2);
      cy.setDatepickerDropdown('Custom');
      cy.get('[data-cy="endDateTime"] .react-datetime-picker__inputGroup__month').click();
      cy.get('.react-calendar__month-view__days__day--weekend').eq(0).click();
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 0)
        .next()
        .contains('li', 'Failed')
        .contains('li', 0)
        .next()
        .contains('li', 'Running')
        .contains('li', 0);
    });

    it('Should update the table when the Results Per Page and Page dropdowns are changed.', () => {
      cy.visit('/granules');
      cy.get('.table__header .filter-limit').as('limit-input');
      cy.get('@limit-input').should('be.visible').click().type('{backspace}{backspace}10{enter}');
      cy.url().should('include', 'limit=10');
      cy.get('.table .tbody .tr').should('have.length', 10);
      cy.get('.pagination-list ol li')
        .first().contains('li', 'Previous')
        .next()
        .contains('li', '1')
        .next()
        .contains('li', '2');
      cy.get('.table__header .filter-page').as('page-input');
      cy.get('@page-input').should('be.visible').click().type('{backspace}2{enter}');
      cy.url().should('include', 'page=2');
      cy.get('.table .tbody .tr').should('have.length', 1);
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
      cy.route('GET', `/granules/${granuleId}`).as('getGranule');
      cy.visit('/granules');
      cy.get(`[data-value="${granuleId}"] > .td >input[type="checkbox"]`).click();
      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert', { timeout: 10000 }).should('contain.text', 'Success');
      cy.get('.button__goto').click();
      cy.wait('@getGranule');
      cy.url().should('include', `granules/granule/${granuleId}`);
      cy.get('.heading--large').should('have.text', `Granule: ${granuleId}`);
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
      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert', { timeout: 10000 }).should('contain.text', 'Success');
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
      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert', { timeout: 10000 }).should('contain.text', 'Error');
      cy.get('.Collapsible__contentInner').should('contain.text', 'Oopsie');
      cy.get('.button--cancel').click();
      cy.url().should('match', /\/granules/);
      cy.get('.heading--large').should('have.text', 'Granule Overview');
    });

    it('Should have a Granule Lists page', () => {
      const listName = 'GranuleList100220';
      const url = `**/reconciliationReports/${listName}`;
      cy.intercept({ url: '**/reconciliationReports?limit=*', method: 'GET' }).as('getLists');
      cy.intercept({ url, method: 'GET' }).as('getList');
      cy.visit('/granules');
      cy.contains('.sidebar li a', 'Lists').click();
      cy.wait('@getLists');
      cy.url().should('include', '/granules/lists');
      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 1);
      cy.contains('.table .td a', listName)
        .should('be.visible')
        .click({ force: true });

      cy.wait('@getList').its('response.body').should('include', 'url');
    });

    it('Should open modal to create granule inventory report', () => {
      const listName = 'GranuleListTest';
      const status = 'running';
      const collectionId = 'MOD09GQ___006';
      // granule IDs in alphanumeric order. We sort the actual result for comparison.
      const granuleIds = [
        'MOD09GQ.A0501579.PZB_CG.006.8580266395214',
        'MOD09GQ.A1657416.CbyoRi.006.9697917818587'
      ];

      cy.intercept({
        url: '/reconciliationReports',
        method: 'POST'
      }, (req) => {
        const requestBody = JSON.parse(req.body);
        expect(requestBody).to.have.property('reportType', 'Granule Inventory');
        expect(requestBody).to.have.property('reportName', listName);
        expect(requestBody).to.have.property('status', status);
        expect(requestBody).to.have.property('collectionId', collectionId);
        expect(requestBody.granuleId.sort()).to.deep.equal(granuleIds);
      }).as('createList');

      cy.visit('/granules');

      // Enter status field
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').click().type(status).type('{enter}');

      // Enter collection field
      cy.get('.filter-collectionId .rbt-input-main').as('collection-input');
      cy.get('@collection-input').click().type(collectionId).type('{enter}');

      // Select both granules in list
      cy.get('.table .tbody .tr .td input[type=checkbox]').as('granule-checkbox');
      cy.get('@granule-checkbox').click({ multiple: true });

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Create Granule Inventory List').click();
      cy.get('.default-modal.granule-inventory ').as('modal');

      cy.get('@modal').contains('div', 'You have generated a selection to process for the following list:');
      cy.get('@modal').find('.list-name input').clear().type(listName);
      cy.get('@modal').find('.button--submit').click();
      cy.get('@modal').contains('div', 'The following request is being processed and will be available shortly');
      cy.get('@modal').contains('.list-name', listName);
      cy.get('@modal').find('.button--submit').click();

      cy.url().should('include', '/granules/lists');
    });

    it('Should filter failed granules by error type', () => {
      cy.visit('/granules/failed');

      // Get initial table size
      cy.get('.table .tbody .tr').should('have.length', 2);

      // Filter the results by an error type
      cy.get('.filter-error .rbt-input-main').as('error-input');
      cy.get('@error-input').click().type('FileNotFound').type('{enter}');

      // Get new table size
      cy.get('.table .tbody .tr').should('have.length', 1);
    });

    it('should show number of selected results in table', () => {
      cy.visit('/granules');

      cy.get('.table .thead input[type="checkbox"]').as('select-all');
      cy.get('.table .tbody .tr').as('list');

      cy.get('@list').should('have.length', 11);
      cy.get('@select-all').check();
      cy.get('@select-all').should('be.checked');
      cy.contains('.table__header', '(11 selected)');
    });

    it('should clear the selection when a filter is applied', () => {
      const granuleIds = [
        'MOD09GQ.A0142558.ee5lpE.006.5112577830916',
        'MOD09GQ.A9344328.K9yI3O.006.4625818663028'
      ];
      cy.visit('/granules');

      cy.get('.table .tbody').as('table-body');
      cy.get('.table .tbody .tr').as('list');
      cy.get('.filter-status .rbt-input-main').as('status-input');

      cy.get('@list').should('have.length', 11);
      cy.get('@table-body').contains('.td', granuleIds[0]).as('granule1');
      cy.get('@granule1').siblings().contains('.td', 'Completed');
      cy.get('@granule1').siblings().find('input[type="checkbox"]').check();

      cy.get('@table-body').contains('.td', granuleIds[1]).as('granule2');
      cy.get('@granule2').siblings().contains('.td', 'Failed');
      cy.get('@granule2').siblings().find('input[type="checkbox"]').check();

      cy.contains('.table__header', '(2 selected)');

      // (X selected) only in header when items are selected
      // verify that nothing is selected when filter is applied
      cy.get('@status-input').click().type('run').type('{enter}');
      cy.get('@list').should('have.length', 2);
      cy.get('.table__header').should('not.contain.text', 'selected');

      // verify items still not selected when filter is cleared
      cy.get('@status-input').clear();
      cy.get('@list').should('have.length', 11);
      cy.get('.table__header').should('not.contain.text', 'selected');
    });

    it('Should update overview metrics when visiting bookmarkable URL with a provider param', () => {
      cy.visit('/granules?provider=PODAAC_SWOT');
      cy.get('.filter-provider .rbt-input-main').as('provider-input');
      cy.get('@provider-input').should('have.value', 'PODAAC_SWOT');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 0).and('contain', 'Completed')
          .next()
          .should('contain', 0)
          .and('contain', 'Failed')
          .next()
          .should('contain', 0)
          .and('contain', 'Running');
      });

      cy.visit('/granules?provider=s3_provider');
      cy.get('.filter-provider .rbt-input-main').as('provider-input');
      cy.get('@provider-input').should('have.value', 's3_provider');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 7).and('contain', 'Completed')
          .next()
          .should('contain', 2)
          .and('contain', 'Failed')
          .next()
          .should('contain', 2)
          .and('contain', 'Running');
      });
    });

    it('Should update URL and overview section when provider dropdown filters are activated.', () => {
      cy.visit('/granules');
      cy.get('.filter-provider .rbt-input-main').as('provider-input');
      cy.get('@provider-input').click().type('POD').type('{enter}');
      cy.url().should('include', 'provider=PODAAC_SWOT');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 0).and('contain', 'Completed')
          .next()
          .should('contain', 0)
          .and('contain', 'Failed')
          .next()
          .should('contain', 0)
          .and('contain', 'Running');
      });
    });

    it('Should show the correct DELETE modal when published granules ARE selected', () => {
      // this granules query will have a combination of published and unpublished granules
      cy.visit('/granules?limit=50&page=1&status=completed');

      cy.get('.table .tbody .tr .td input[type=checkbox]').as('granule-checkbox');
      cy.get('@granule-checkbox').click({ multiple: true });

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Delete').click();
      cy.get('.default-modal.batch-async-modal ').as('modal');

      cy.get('@modal').contains('div', 'Selection contains granules that are published to CMR which must be removed before deleting. Remove published granules from CMR and delete?');
    });

    it('Should show the correct DELETE modal when published granules are selected on the "processing granules" page', () => {
      // All granules in the "processing" state are published
      cy.visit('/granules/processing?limit=50');

      cy.get('.table .tbody .tr .td input[type=checkbox]').as('granule-checkbox');
      cy.get('@granule-checkbox').click({ multiple: true });

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Delete').click();
      cy.get('.default-modal.batch-async-modal ').as('modal');

      cy.get('@modal').contains('div', 'Selection contains granules that are published to CMR which must be removed before deleting. Remove published granules from CMR and delete?');
    });

    it('Should show the correct DELETE modal when published granules are NOT selected', () => {
      // published = false will return a table with only unpublished granules
      cy.visit('/granules?limit=50&page=1&published=false');

      cy.get('.table .tbody .tr .td input[type=checkbox]').as('granule-checkbox');
      cy.get('@granule-checkbox').click({ multiple: true });

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Delete').click();
      cy.get('.default-modal.batch-async-modal ').as('modal');

      cy.get('@modal').contains('div', 'Delete 5 granules?');
    });

    it('Should handle a successful API response from the Remove and Delete granule requests', () => {
      cy.server();
      cy.route({
        method: 'PUT',
        url: '/granules/*',
        status: 200,
        response: { message: 'success' }
      });

      cy.route({
        method: 'DELETE',
        url: '/granules/*',
        status: 200,
        response: { message: 'success' }
      });

      // this granules query will have a combination of published and unpublished granules
      cy.visit('/granules?limit=50&page=1&status=completed');

      cy.get('.table .tbody .tr .td input[type=checkbox]').as('granule-checkbox');
      cy.get('@granule-checkbox').click({ multiple: true });

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Delete').click();
      cy.contains('.button--submit', 'Confirm').click();

      cy.intercept({
        url: '/granules',
        method: 'PUT'
      }, (req) => {
        const requestBody = JSON.parse(req.body);
        expect(requestBody).to.have.property('action', 'removeFromCmr');
      });

      cy.get('.default-modal.batch-async-modal ').as('modal');
      cy.get('@modal').contains('div', 'Success!');
    });

    it('Should handle a failed API response from the Remove granule requests', () => {
      cy.server();
      cy.route({
        method: 'PUT',
        url: '/granules/*',
        status: 400,
        response: { message: 'error' }
      });

      cy.route({
        method: 'DELETE',
        url: '/granules/*',
        status: 200,
        response: { message: 'success' }
      });

      // this granules query will have a combination of published and unpublished granules
      cy.visit('/granules?limit=50&page=1&status=completed');

      cy.get('.table .tbody .tr .td input[type=checkbox]').as('granule-checkbox');
      cy.get('@granule-checkbox').click({ multiple: true });

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Delete').click();
      cy.contains('.button--submit', 'Confirm').click();

      cy.get('.default-modal.batch-async-modal ').as('modal');
      cy.get('@modal').contains('div', 'Error');
    });

    it('Should handle a failed API response from the Delete granule requests', () => {
      cy.server();
      cy.route({
        method: 'PUT',
        url: '/granules/*',
        status: 200,
        response: { message: 'success' }
      });

      cy.route({
        method: 'DELETE',
        url: '/granules/*',
        status: 400,
        response: { message: 'error' }
      });

      // this granules query will have a combination of published and unpublished granules
      cy.visit('/granules?limit=50&page=1&status=completed');

      cy.get('.table .tbody .tr .td input[type=checkbox]').as('granule-checkbox');
      cy.get('@granule-checkbox').click({ multiple: true });

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Delete').click();
      cy.contains('.button--submit', 'Confirm').click();

      cy.get('.default-modal.batch-async-modal ').as('modal');
      cy.get('@modal').contains('div', 'Error');
    });
  });
});
