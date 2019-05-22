import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Reconciliation Reports Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/reconciliation-reports');
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

    it('displays a link to view reconciliation reports', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Reconciliation Reports').as('reconciliationReports');
      cy.get('@reconciliationReports').should('have.attr', 'href', '#/reconciliation-reports');
      cy.get('@reconciliationReports').click({ force: true });

      cy.url().should('include', 'reconciliation-reports');
      cy.contains('.heading--large', 'Reconciliation Reports Overview');
    });

    it('displays a list of reconciliation reports', () => {
      cy.visit('#/reconciliation-reports');

      cy.get('table tbody tr').its('length').should('be.eq', 3);
      cy.contains('table tbody tr a', 'report-2018-04-20T20:58:38.883Z.json')
        .should('have.attr', 'href', '#/reconciliation-reports/report/report-2018-04-20T20:58:38.883Z.json');
      cy.contains('table tbody tr a', 'report-2018-05-20T20:58:38.883Z.json')
        .should('have.attr', 'href', '#/reconciliation-reports/report/report-2018-05-20T20:58:38.883Z.json');
      cy.contains('table tbody tr a', 'report-2018-06-20T20:58:38.883Z.json')
        .should('have.attr', 'href', '#/reconciliation-reports/report/report-2018-06-20T20:58:38.883Z.json');
    });

    it('displays a link to an individual report', () => {
      cy.visit('/#/reconciliation-reports');

      cy.contains('table tbody tr a', 'report-2018-05-20T20:58:38.883Z.json')
        .should('have.attr', 'href', '#/reconciliation-reports/report/report-2018-05-20T20:58:38.883Z.json')
        .click();

      cy.contains('.heading--large', 'report-2018-05-20T20:58:38.883Z.json');

      /** Summary **/

      cy.contains('dl dd', '2018-06-11T18:52:37.710Z');
      cy.contains('dl dd', 'SUCCESS');
      cy.contains('dl dt', 'Files in DynamoDB and S3')
        .next('dd')
        .contains('21');
      cy.contains('dl dt', 'Granules in Cumulus and CMR')
        .next('dd')
        .contains('1');
      cy.contains('dl dt', 'Granule files in Cumulus and CMR')
        .next('dd')
        .contains('4');
      cy.contains('dl dt', 'Collections in Cumulus and CMR')
        .next('dd')
        .contains('1');

      /** Files **/

      cy.contains('h3', 'Files only in DynamoDB (2)')
        .next()
        .find('table tbody')
        .as('dynamoTable');
      cy.get('@dynamoTable').find('tr').its('length').should('be.eq', 2);
      cy.get('@dynamoTable')
        .children('tr')
        .first()
        .within(() => {
          cy.contains('g-123');
          cy.contains('key-123.hdf');
          cy.contains('some-bucket');
          cy.contains('a', 'Link')
            .should('have.attr', 'href', 's3://some-bucket/path/to/key-123.hdf');
        });

      cy.contains('h3', 'Files only in S3 (2)')
        .next()
        .find('table tbody')
        .as('s3Table');
      cy.get('@s3Table').find('tr').its('length').should('be.eq', 2);
      cy.get('@s3Table')
        .children('tr')
        .first()
        .within(() => {
          cy.contains('key-1.hdf');
          cy.contains('some-bucket');
          cy.contains('a', 'Link')
            .should('have.attr', 'href', 's3://some-bucket/path/to/key-1.hdf');
        });

      /** Collections **/

      cy.contains('h3', 'Collections only in Cumulus (2)')
        .next()
        .find('table tbody')
        .as('cumulusCollectionsTable');
      cy.get('@cumulusCollectionsTable').find('tr').its('length').should('be.eq', 2);
      cy.get('@cumulusCollectionsTable')
        .within(() => {
          cy.contains('collection_1');
          cy.contains('collection_2');
        });

      cy.contains('h3', 'Collections only in CMR (2)')
        .next()
        .find('table tbody')
        .as('cmrCollectionsTable');
      cy.get('@cmrCollectionsTable').find('tr').its('length').should('be.eq', 2);
      cy.get('@cmrCollectionsTable')
        .within(() => {
          cy.contains('collection_3');
          cy.contains('collection_4');
        });

     /** Granules **/

      cy.contains('h3', 'Granules only in Cumulus (1)')
        .next()
        .find('table tbody')
        .as('cumulusGranulesTable');
      cy.get('@cumulusGranulesTable').find('tr').its('length').should('be.eq', 1);
      cy.get('@cumulusGranulesTable')
        .within(() => {
          cy.contains('granule.123');
        });

      cy.contains('h3', 'Granules only in CMR (2)')
        .next()
        .find('table tbody')
        .as('cmrGranulesTable');
      cy.get('@cmrGranulesTable').find('tr').its('length').should('be.eq', 2);
      cy.get('@cmrGranulesTable')
        .within(() => {
          cy.contains('granule456.001');
          cy.contains('granule789.001');
        });

      /** Granule files **/

      cy.contains('h3', 'Granule files only in Cumulus (1)')
        .next()
        .find('table tbody')
        .as('cumulusGranulesFilesTable');
      cy.get('@cumulusGranulesFilesTable').find('tr').its('length').should('be.eq', 1);
      cy.get('@cumulusGranulesFilesTable')
        .children('tr')
        .first()
        .within(() => {
          cy.contains('granule.001.1234');
          cy.contains('granule.001.1234.jpg');
          cy.contains('some-bucket');
          cy.contains('a', 'Link')
            .should('have.attr', 'href', 's3://some-bucket/granule__001/granule.001.1234.jpg');
        });

      cy.contains('h3', 'Granule files only in CMR (1)')
        .next()
        .find('table tbody')
        .as('cmrGranulesFilesTable');
      cy.get('@cmrGranulesFilesTable').find('tr').its('length').should('be.eq', 1);
      cy.get('@cmrGranulesFilesTable')
        .children('tr')
        .first()
        .within(() => {
          cy.contains('granule.002.5678');
          cy.contains('granule.002.5678.jpg');
          cy.contains('some-bucket');
          cy.contains('a', 'Link')
            .should('have.attr', 'href', 's3://some-bucket/granule__002/granule.002.5678.jpg');
        });
    });

    it('displays the create a report button', () => {
      cy.visit('/#/reconciliation-reports');

      cy.contains('button', 'Create a Report')
        .click();

      cy.reload();

      // Logging for info for intermittent test fail
      cy.get('table tbody tr a')
        .then((items) => {
          cy.task('log', `Report item count: ${items.length}`);
          if (items.length < 4) {
            cy.reload();
          }

          cy.contains('table tbody tr a', 'created_report.json')
            .should('have.attr', 'href', '#/reconciliation-reports/report/created_report.json');

          expect(items.length).to.eq(4);
        });
    });
  });
});
