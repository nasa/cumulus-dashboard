import moment from 'moment';
import { shouldBeRedirectedToLogin } from '../support/assertions';
import { dateTimeFormat } from '../../app/src/js/utils/datepicker';
import { tableColumns } from '../../app/src/js/utils/table-config/reconciliation-reports';
import { displayCase } from '../../app/src/js/utils/format';

const tableColumnHeaders = tableColumns({ isGranules: false }).map((column) => column.Header);

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
      cy.get('.table .tbody .tr').should('have.length', 6);
      cy.get('[data-value="inventoryReport-2020/01/14T202529026"] > .table__main-asset > a').should('have.attr', 'href', '/reconciliation-reports/report/inventoryReport-2020%2F01%2F14T202529026');
      cy.get('[data-value="inventoryReport-20200114T205238781"] > .table__main-asset > a').should('have.attr', 'href', '/reconciliation-reports/report/inventoryReport-20200114T205238781');
    });

    it('has a column toggle on the report list page', () => {
      cy.visit('/reconciliation-reports');

      cy.contains('.table__filters .button__filter', 'Show/Hide Columns').click();
      cy.get('.table__filters--collapse').should('be.visible');

      tableColumnHeaders.forEach((header) => {
        cy.contains('.table .th', header).should('be.visible');
        cy.contains('.table__filters--filter label', header).find('span').click();
        cy.get('.button__apply-filter').click();
        cy.contains('.table .th', header).should('not.exist');
        cy.contains('.table__filters--filter label', header).find('span').click();
        cy.get('.button__apply-filter').click();
        cy.contains('.table .th', header).should('be.visible');
      });

      cy.contains('.table__filters .button__filter', 'Show/Hide Columns').click();
      cy.get('.table__filters--collapse').should('not.be.visible');
      cy.contains('.table__filters .button__filter', 'Show/Hide Columns');
    });

    it('should update dropdown with label when visiting bookmarkable URL', () => {
      cy.visit('/reconciliation-reports?status=Generated');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('have.value', 'Generated');

      cy.visit('/reconciliation-reports?type=Inventory');
      cy.get('.filter-type .rbt-input-main').as('type-input');
      cy.get('@type-input').should('have.value', 'Inventory');
    });

    it('should show Search and Dropdown filters in URL', () => {
      cy.visit('/reconciliation-reports');
      cy.get('.search').as('search');
      cy.get('@search').should('be.visible').click().type('inventoryReport-2020');

      cy.get('.filter-type .rbt-input-main').as('type-input');
      cy.get('@type-input').should('be.visible').click({ force: true }).type('invent{enter}');
      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').should('be.visible').click({ force: true }).type('gener{enter}');
      cy.url({ timeout: 10000 }).should('include', 'search=inventoryReport-2020')
        .and('include', 'type=Inventory')
        .and('include', 'status=Generated');
      cy.get('.table .tbody .tr').should('have.length', 2);
    });

    it('should have a download button column', () => {
      cy.visit('/reconciliation-reports');
      cy.get('.button__row--download').should('have.length', 6);
    });

    it('deletes a report when the Delete button is clicked', () => {
      cy.visit('/reconciliation-reports');
      cy.get('[data-value="inventoryReport-2020/01/14T202529026"]').find('.button__row--delete').click({ force: true });

      cy.get('.table .tbody .tr').should('have.length', 5);
      cy.get('[data-value="inventoryReport-2020/01/14T202529026"]')
        .should('not.exist');
    });

    it('should have the create a report page', () => {
      const path = '/reconciliation-reports/create';
      const reportType = 'Internal';
      const reportName = 'InternalReport2020';
      const startTime = new Date('2009-01-31T00:00:00.000');
      const startTimestamp = moment(moment.utc(startTime).format(dateTimeFormat)).valueOf();
      const endTime = new Date('2010-05-01T00:00:00.000');
      const endTimestamp = moment(moment.utc(endTime).format(dateTimeFormat)).valueOf();
      const collectionId = ['http_testcollection___001'];
      const location = 'S3';

      cy.visit('/reconciliation-reports');
      cy.contains(`div a[href="${path}"]`, 'Create New Report').click();

      cy.contains('.heading--large', 'Create Report');

      cy.get('form .form__item .reportType').as('reportType');
      cy.get('@reportType').find('input[name="reportType"]').should('have.value', 'Inventory');
      cy.contains('.main-form--wrapper h2', 'Inventory');
      cy.get('@reportType').click().type('inter{enter}');
      cy.get('@reportType').find('input[name="reportType"]').should('have.value', reportType);
      cy.contains('.main-form--wrapper h2', reportType);

      cy.get('form .form__item .reportName').as('reportName');
      cy.get('@reportName').should('be.visible').click().type(reportName);

      cy.get('form .form__item .startTimestamp').within(() => {
        cy.get('input[name=month]').click().type(1);
        cy.get('input[name=day]').click().type(31);
        cy.get('input[name=year]').click().type(2009);
        cy.get('input[name=hour12]').click().type(0);
        cy.get('input[name=minute]').click().type(0);
        cy.get('select[name=amPm]').select('AM');
      });
      cy.get('form .form__item .endTimestamp').within(() => {
        cy.get('input[name=month]').click().type(5);
        cy.get('input[name=day]').click().type(1);
        cy.get('input[name=year]').click().type(2010);
        cy.get('input[name=hour12]').click().type(0);
        cy.get('input[name=minute]').click().type(0);
        cy.get('select[name=amPm]').select('AM');
      });

      cy.get('form .form__item .collectionId').as('collectionId');
      cy.get('@collectionId').click().type('http_{enter}');
      cy.get('form .form__item .provider input').should('have.attr', 'disabled');
      cy.get('form .form__item .granuleId input').should('have.attr', 'disabled');

      cy.get(`form .form__item .location input[value="${location}"]`).check();

      cy.intercept({
        url: '/reconciliationReports',
        method: 'POST'
      }, (req) => {
        const { body } = req;
        expect(body).to.have.property('reportType', reportType);
        expect(body).to.have.property('reportName', reportName);
        expect(body).to.have.property('startTimestamp', startTimestamp);
        expect(body).to.have.property('endTimestamp', endTimestamp);
        expect(body).to.have.deep.property('collectionId', collectionId);
        expect(body).to.have.property('location', location);
      }).as('createReport');

      cy.get('.button--submit').click();
      cy.wait('@createReport');

      cy.url().should('not.include', path);
      cy.url().should('include', '/reconciliation-reports');
    });

    it('should be able to choose filters when creating a orca backup report', () => {
      const path = '/reconciliation-reports/create';
      const reportType = 'ORCA Backup';
      const reportName = 'orcaBackupReport-20220111T191341153';
      const collectionId = ['http_testcollection___001', 'MOD09GQ___006'];
      const provider = ['s3_provider'];
      const granuleId = ['MOD09GQ.A9344328.K9yI3O.006.4625818663028'];

      cy.visit('/reconciliation-reports/create');
      cy.contains('.heading--large', 'Create Report');

      cy.get('form .form__item .reportType').as('reportType');
      cy.get('@reportType').click().type('orca{enter}');
      cy.get('@reportType').find('input[name="reportType"]').should('have.value', reportType);
      cy.contains('.main-form--wrapper h2', displayCase(reportType));

      cy.get('form .form__item .reportName').as('reportName');
      cy.get('@reportName').should('be.visible').click().type(reportName);

      cy.get('form .form__item .provider').as('provider');
      cy.get('@provider').click().type('s3_{enter}');
      cy.get('form .form__item .collectionId').as('collectionId');
      cy.get('@collectionId').click().type('http_{enter}');
      cy.get('@collectionId').click().type('MOD09GQ_{enter}');
      cy.get('form .form__item .granuleId').as('granuleId');
      cy.get('@granuleId').click().type('MOD09GQ.A93{enter}');

      cy.intercept({
        url: '/reconciliationReports',
        method: 'POST'
      }, (req) => {
        const { body } = req;
        expect(body).to.have.property('reportType', reportType);
        expect(body).to.have.property('reportName', reportName);
        expect(body).to.have.deep.property('provider', provider);
        expect(body).to.have.deep.property('collectionId', collectionId);
        expect(body).to.have.deep.property('granuleId', granuleId);
      }).as('createReport');

      cy.get('.button--submit').click();
      cy.wait('@createReport');

      cy.url().should('not.include', path);
      cy.url().should('include', '/reconciliation-reports');
    });

    it('displays an individual Inventory report', () => {
      const reportName = 'inventoryReport-20200114T205238781';
      const path = `/reconciliation-reports/report/${reportName}`;

      cy.visit('/reconciliation-reports');
      cy.contains(`.table .tbody .tr a[href="${path}"]`, reportName);

      cy.visit(path);
      cy.contains('.heading--large', `Inventory Report: ${reportName}`);

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
        // collections do not have select column, so need to check first column
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
        if (cards[index].firstColumn) {
          cy.get('.table .th').eq(0).contains(cards[index].firstColumn);
        }

        if (cards[index].secondColumn) {
          cy.get('.table .th').eq(1).contains(cards[index].secondColumn);
        }
      });

      /** Table Filters **/
      cy.get('.table__filters');
      cy.get('.multicard__table').eq(0)
        .within(() => {
          cy.contains('.table__filters .button__filter', 'Show/Hide Columns').click();
          cy.get('.table__filters--collapse').should('be.visible');
          const filterLabel = 'Collection name';

          cy.contains('.table .th', filterLabel).should('be.visible');
          cy.contains('.table__filters--filter label', filterLabel).find('span').click();
          cy.get('.button__apply-filter').click();
          cy.contains('.table .th', filterLabel).should('not.exist');

          cy.contains('.table__filters .button__filter', 'Show/Hide Columns').click();
          cy.get('.table__filters--collapse').should('not.be.visible');
          cy.contains('.table__filters .button__filter', 'Show/Hide Columns');
        });

      /** Pagination */
      cy.contains('.pagination__link--active', '1');
      cy.contains('.pagination button', 'Next').click();
      cy.contains('.pagination__link--active', '2');

      /** Legend - there should be one for each table */
      cy.get('.legend').should('have.length', 3);
      cy.get('.legend').eq(0).as('legend1');
      cy.get('@legend1').find('.legend-items--item').should('have.length', 3);
      cy.get('@legend1').find('.legend-items--item').eq(0).should('contain', 'Granule not found');
      cy.get('@legend1').find('.legend-items--item').eq(1).should('contain', 'Missing image file');
      cy.get('@legend1').find('.legend-items--item').eq(2).should('contain', 'No issues/conflicts');
    });

    it('Has a way to expand/collapse all tables', () => {
      cy.visit('/reconciliation-reports/report/inventoryReport-20200114T205238781');
      cy.contains('.card-header', 'Cumulus').click();
      cy.get('.multicard__header').should('exist');
      cy.get('.multicard__header--expanded').should('have.length', 1);
      cy.get('.link').should('contain', 'Expand All').click();

      cy.get('.multicard__header--expanded').should('exist');
      cy.get('.multicard__header--expanded').should('have.length', 3);
      cy.get('.link').should('contain', 'Collapse All');

      cy.get('.multicard__header').eq(0).click();
      cy.get('.link').should('contain', 'Expand All');
      cy.get('.multicard__header--expanded').should('have.length', 2);
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

    it('displays an individual Granule Not Found report', () => {
      const reportName = 'granuleNotFoundReport-20200827T210339679';
      const path = `/reconciliation-reports/report/${reportName}`;

      cy.visit('/reconciliation-reports');
      cy.contains(`.table .tbody .tr a[href="${path}"]`, reportName);

      cy.visit(path);
      cy.contains('.heading--large', `Granule Not Found Report: ${reportName}`);

      cy.contains('.heading--medium', 'Total Conflict Comparisons');
      cy.contains('.num-title', '11');

      cy.get('.table .th').eq(0).should('contain', 'Collection ID');
      cy.get('.table .th').eq(1).should('contain', 'Granule ID');
      cy.get('.table .th').eq(2).should('contain', 'S3');
      cy.get('.table .th').eq(3).should('contain', 'Cumulus');
      cy.get('.table .th').eq(4).should('contain', 'CMR');

      cy.get('.table .tbody .tr[data-value="MOD09GQ.A0002421.oD4zvB.006.4281362831355"] .td').eq(0).should('contain', 'MOD09GQ___006');
      cy.get('.table .tbody .tr[data-value="MOD09GQ.A0002421.oD4zvB.006.4281362831355"] .td').eq(1).should('contain', 'MOD09GQ.A0002421.oD4zvB.006.4281362831355');
      cy.get('.table .tbody .tr[data-value="MOD09GQ.A0002421.oD4zvB.006.4281362831355"] .td').eq(2).find('span').should('have.class', 'status-indicator--failed');
      cy.get('.table .tbody .tr[data-value="MOD09GQ.A0002421.oD4zvB.006.4281362831355"] .td').eq(3).find('span').should('have.class', 'status-indicator--failed');
      cy.get('.table .tbody .tr[data-value="MOD09GQ.A0002421.oD4zvB.006.4281362831355"] .td').eq(4).find('span').should('have.class', 'status-indicator--success');

      /** Legend */
      cy.get('.legend').should('have.length', 1);
      cy.get('.legend-items--item').should('have.length', 3);
      cy.get('.legend-items--item').eq(0).should('contain', 'Granule not found');
      cy.get('.legend-items--item').eq(1).should('contain', 'Missing image file');
      cy.get('.legend-items--item').eq(2).should('contain', 'No issues/conflicts');
    });

    it('should download the Internal report with the report link', () => {
      const reportName = 'InternalReport092020';
      cy.visit('/reconciliation-reports');
      cy.get(`[data-value="${reportName}"]`).find('.button__row--download').should('have.length', 1);
    });

    it('displays an individual ORCA report', () => {
      const reportName = 'orcaBackupReport-20220111T191341153';
      const granuleId = 'MYD13Q1.A3194547.tnYsne.006.8400707913298';
      const collectionId = 'MYD13Q1___006';
      const provider = 's3_provider';
      const path = `/reconciliation-reports/report/${reportName}`;

      cy.visit('/reconciliation-reports');
      cy.contains(`.table .tbody .tr a[href="${path}"]`, reportName);

      cy.visit(path);
      cy.contains('.heading--large', `ORCA Backup Report: ${reportName}`);

      // table columns
      cy.get('.table .tbody .tr').should('have.length', 3);
      cy.get(`[data-value="${granuleId}"]`).children().as('columns');
      cy.get('@columns').should('have.length', 5);
      cy.get('@columns').eq(0).invoke('text')
        .should('be.eq', granuleId);
      cy.get('@columns').eq(1).invoke('text')
        .should('be.eq', 'withConflicts');
      cy.get('@columns').eq(2).invoke('text')
        .should('be.eq', 'View Details');
      cy.get('@columns').eq(3).invoke('text')
        .should('be.eq', collectionId);
      cy.get('@columns').eq(4).invoke('text')
        .should('be.eq', provider);

      /** Table Filters **/
      cy.get('.table__filters');
      cy.contains('.table__filters .button__filter', 'Show/Hide Columns').click();
      cy.get('.table__filters--collapse').should('be.visible');
      const filterLabel = 'Granule ID';

      cy.contains('.table .th', filterLabel).should('be.visible');
      cy.contains('.table__filters--filter label', filterLabel).find('span').click();
      cy.get('.button__apply-filter').click();
      cy.contains('.table .th', filterLabel).should('not.exist');

      cy.contains('.table__filters .button__filter', 'Show/Hide Columns').click();
      cy.get('.table__filters--collapse').should('not.be.visible');
      cy.contains('.table__filters .button__filter', 'Show/Hide Columns');
    });

    it('displays conflict details for a granule in the ORCA report', () => {
      const reportName = 'orcaBackupReport-20220111T191341153';
      const granuleId = 'MYD13Q1.A3194547.tnYsne.006.8400707913298';
      const fileName = 'MYD13Q1.A3194547.tnYsne.006.8400707913298.cmr.xml';
      const fileBucket = 'cumulus-test-sandbox-protected-2';
      const conflictDetailsPage = `/reconciliation-reports/report/${reportName}/details`;
      const collection = 'MYD13Q1 / 006';
      const provider = 's3_provider';

      // granule conflict details page needs data from the report
      cy.visit(`/reconciliation-reports/report/${reportName}`);
      cy.get(`.table .tbody [data-value="${granuleId}"]`)
        .contains('.td a', 'View Details')
        .click();

      cy.wait(1000);
      cy.url().should('include', conflictDetailsPage);

      // header
      cy.contains('.heading--large', `ORCA Backup Report: ${reportName}`);
      cy.get('.heading--medium')
        .first().should('have.text', `Granule: ${granuleId}`);
      cy.get('.heading--medium')
        .eq(1).should('have.text', 'Conflict Details');
      cy.get('.metadata__details')
        .within(() => {
          cy.get('dt')
            .contains('Collection')
            .next('dd')
            .should('contain', collection);
          cy.get('dt')
            .contains('Provider')
            .next('dd')
            .contains(provider)
            .should('have.attr', 'href', `/providers/provider/${provider}`);
          cy.get('dt')
            .contains('Ingest');
          cy.get('dt')
            .contains('Location');
        });

      // table
      cy.get('.table .tbody .tr').should('have.length', 3);
      cy.get(`[data-value="${fileName}"]`).children().as('columns');
      cy.get('@columns').should('have.length', 6);
      cy.get('@columns').eq(1).invoke('text')
        .should('be.eq', 'Link');
      cy.get('@columns').eq(1).children('a')
        .should('have.attr', 'href')
        .and('include', fileName);
      cy.get('@columns').eq(2).invoke('text')
        .should('be.eq', '--');
      cy.get('@columns').eq(3).invoke('text')
        .should('be.eq', '--');
      cy.get('@columns').eq(4).children('button').should('have.class', 'button__row--check');
      cy.get('@columns').eq(5).invoke('text')
        .should('be.eq', fileBucket);
    });

    it('should have the option to search the report', () => {
      cy.visit('/reconciliation-reports/report/inventoryReport-20200114T205238781');

      cy.get('.search').as('search');
      cy.get('@search').should('be.visible').click().type('MOD09GQ');

      /** Table Cards **/

      const cards = [
        {
          title: 'DynamoDB',
          count: 12
        },
        {
          title: 'S3',
          count: 214
        },
        {
          title: 'Cumulus',
          count: 3
        },
        {
          title: 'CMR',
          count: 1
        }
      ];

      cy.get('.card').each(($card, index, $cards) => {
        const card = cy.wrap($card);
        card.click();
        card.should('have.class', 'active');
        card.get('.card-header').contains(cards[index].title);
        card.get('.card-title').contains(cards[index].count);
      });
    });

    it('should have the option to filter the report by S3 bucket', () => {
      cy.visit('/reconciliation-reports/report/inventoryReport-20200114T205238781');

      cy.get('.filter-bucket .rbt-input-main').as('bucket-input');
      cy.get('@bucket-input').should('be.visible').click().type('mhs3-pri{enter}');

      /** Table Cards **/

      const cards = [
        {
          title: 'DynamoDB',
          count: 10
        },
        {
          title: 'S3',
          count: 36
        },
        {
          title: 'Cumulus',
          count: 20
        },
        {
          title: 'CMR',
          count: 390
        }
      ];

      cy.get('.card').each(($card, index, $cards) => {
        const card = cy.wrap($card);
        card.click();
        card.should('have.class', 'active');
        card.get('.card-header').contains(cards[index].title);
        card.get('.card-title').contains(cards[index].count);
      });
    });

    it('Should dynamically update menu, sidbar and breadcrumb /reconciliation-reports links with latest filter criteria', () => {
      const type = 'Internal';
      const status = 'Generated';
      const search = 'InternalReport092020';

      cy.visit('/reconciliation-reports');

      cy.get('#type').as('type-input');
      cy.get('@type-input').click().type(type).type('{enter}');

      cy.get('#status').as('status-input');
      cy.get('@status-input').click().type(status).type('{enter}');

      cy.get('#search').as('search-input');
      cy.get('@search-input').click().type(search).type('{enter}');

      cy.get('img').click();

      // Menu <Link>s contain correct query params
      cy.get(':nth-child(9) > a')
        .should('have.attr', 'href')
        .and('include', `type=${type}`)
        .and('include', `status=${status}`)
        .and('include', `search=${search}`);
    });
  });
});
