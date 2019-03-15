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

    xit('displays a link to view reconciliation reports', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Reconciliation Reports').as('reconciliationReports');
      cy.get('@reconciliationReports').should('have.attr', 'href', '#/reconciliation-reports');
      cy.get('@reconciliationReports').click({ force: true });

      cy.url().should('include', 'reconciliation-reports');
      cy.contains('.heading--large', 'Reconciliation Reports Overview');
    });

    xit('displays a list of reconciliation reports', () => {
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

      cy.contains('dl dd', '2018-06-11T18:52:37.710Z');
      cy.contains('dl dd', 'SUCCESS');
      cy.contains('dl dt', 'Files in DynamoDB and S3')
        .next('dd')
        .contains('21');
      cy.contains('dl dt', 'Files in Cumulus and CMR')
        .next('dd')
        .contains('4');
      cy.contains('dl dt', 'Collections in Cumulus and CMR')
        .next('dd')
        .contains('1');
      cy.contains('dl dt', 'Granules in Cumulus and CMR')
        .next('dd')
        .contains('1');

      // Files only in Dynamo section
      cy.contains('h3', 'Files only in DynamoDB (2)');
      cy.get('table tbody').first().children().its('length').should('be.eq', 2);
      cy.get('table tbody').first()
        .contains('tr td', 'g-123');
      cy.get('table tbody').first()
        .contains('tr td', 'key-123.hdf');
      cy.get('table tbody').first()
        .contains('tr td', 'some-bucket');
      cy.get('table tbody').first()
        .contains('tr td a', 'Link')
        .should('have.attr', 'href', 's3://some-bucket/path/to/key-123.hdf');

      // Files only in S3 section
      cy.contains('h3', 'Files only in S3 (2)');
      cy.get('table tbody').last().children().its('length').should('be.eq', 2);
      cy.get('table tbody').first()
        .contains('tr td', 'g-123');
      cy.get('table tbody').first()
        .contains('tr td', 'key-123.hdf');
      cy.get('table tbody').first()
        .contains('tr td', 'some-bucket');
      cy.get('table tbody').first()
        .contains('tr td a', 'Link')
        .should('have.attr', 'href', 's3://some-bucket/path/to/key-123.hdf');
    });

    xit('displays the create a report button', () => {
      cy.visit('/#/reconciliation-reports');

      cy.contains('button', 'Create a Report')
        .click();

      cy.reload();

      cy.contains('table tbody tr a', 'created_report.json')
        .should('have.attr', 'href', '#/reconciliation-reports/report/created_report.json');
    });
  });
});
