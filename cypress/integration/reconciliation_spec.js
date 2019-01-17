import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Collections Page', () => {
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
      // cy.get('@reconciliationReports').click();
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
    });

    it('displays the create a report button', () => {
      cy.visit('/#/reconciliation-reports');

      cy.contains('button', 'Create a Report');
    });
  });
});

/**
 *
 *  {
        "reportStartTime":"2018-06-11T18:52:37.710Z",
        "reportEndTime":"2018-06-11T18:52:39.893Z",
        "status":"SUCCESS",
        "error":null,
        "okFileCount":21,
        "onlyInS3":[
           "s3://some-bucket/path/to/key-1.hdf",
           "s3://some-bucket/path/to/key-2.hdf"
        ],
        "onlyInDynamoDb":[
           {
              "uri":"s3://some-bucket/path/to/key-123.hdf",
              "granuleId":"g-123"
           },
           {
              "uri":"s3://some-bucket/path/to/key-456.hdf",
              "granuleId":"g-456"
           }
        ]
     }
 */