import { shouldBeRedirectedToLogin } from '../support/assertions';

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

      cy.get('.table .tbody .tr').its('length').should('be.eq', 2);
      cy.contains('.table .tbody .tr a', 'report-2020-01-14T20:25:29.026Z.json')
        .should('have.attr', 'href', '/reconciliation-reports/report/report-2020-01-14T20:25:29.026Z.json');
      cy.contains('.table .tbody .tr a', 'report-2020-01-14T20:52:38.781Z.json')
        .should('have.attr', 'href', '/reconciliation-reports/report/report-2020-01-14T20:52:38.781Z.json');
    });

    it('displays a link to an individual report', () => {
      cy.visit('/reconciliation-reports');

      cy.contains('.table .tbody .tr a', 'report-2020-01-14T20:52:38.781Z.json')
        .should('have.attr', 'href', '/reconciliation-reports/report/report-2020-01-14T20:52:38.781Z.json')
        .click();

      cy.contains('.heading--large', 'report-2020-01-14T20:52:38.781Z.json');

      /** Summary **/

      cy.contains('dl dd', '2020-01-14T20:52:38.781Z');
      cy.contains('dl dd', 'SUCCESS');
      cy.contains('dl dt', 'Files in DynamoDB and S3')
        .next('dd')
        .contains('129');
      cy.contains('dl dt', 'Granules in Cumulus and CMR')
        .next('dd')
        .contains('7');
      cy.contains('dl dt', 'Granule files in Cumulus and CMR')
        .next('dd')
        .contains('4');
      cy.contains('dl dt', 'Collections in Cumulus and CMR')
        .next('dd')
        .contains('1');

      /** Files **/

      cy.contains('h3', 'Files only in DynamoDB (35)')
        .next()
        .find('.table .tbody')
        .as('dynamoTable');
      cy.get('@dynamoTable').find('.tr').its('length').should('be.eq', 35);
      cy.get('@dynamoTable')
        .children('.tr')
        .first()
        .within(() => {
          cy.contains('MOD09GQ.A9218123.TJbx_C.006.7667598863143');
          cy.contains('MOD09GQ.A9218123.TJbx_C.006.7667598863143.hdf.met');
          cy.contains('mhs3-private');
          cy.contains('a', 'Link')
            .should('have.attr', 'href', 's3://mhs3-private/MOD09GQ___006/MOD/MOD09GQ.A9218123.TJbx_C.006.7667598863143.hdf.met');
        });

      cy.contains('h3', 'Files only in S3 (216)')
        .next()
        .find('.table .tbody')
        .as('s3Table');
      cy.get('@s3Table').find('.tr').its('length').should('be.eq', 216);
      cy.get('@s3Table')
        .children('.tr')
        .first()
        .within(() => {
          cy.contains('MOD09GQ.A3119781.haeynr.006.4074740546315.hdf.met');
          cy.contains('mhs3-private');
          cy.contains('a', 'Link')
            .should('have.attr', 'href',
              's3://mhs3-private/MOD09GQ___006/MOD/mhs3-IngestGranuleDuplicateHandling-1573838955288/MOD09GQ.A3119781.haeynr.006.4074740546315.hdf.met');
        });

      /** Collections **/

      cy.contains('h3', 'Collections only in Cumulus (13)')
        .next()
        .find('.table .tbody')
        .as('cumulusCollectionsTable');
      cy.get('@cumulusCollectionsTable').find('.tr').its('length').should('be.eq', 13);
      cy.get('@cumulusCollectionsTable')
        .within(() => {
          cy.contains('L2_HR_PIXC_test-mhs3-KinesisTestError-1574717133091___000');
          cy.contains('L2_HR_PIXC_test-mhs3-KinesisTestError-1575912896780___000');
          cy.contains('MOD09GQ_test-mhs3-IngestGranuleSuccess-1576108764706___006');
        });

      cy.contains('h3', 'Collections only in CMR (25)')
        .next()
        .find('.table .tbody')
        .as('cmrCollectionsTable');
      cy.get('@cmrCollectionsTable').find('.tr').its('length').should('be.eq', 25);
      cy.get('@cmrCollectionsTable')
        .within(() => {
          cy.contains('A2_RainOcn_NRT___0');
          cy.contains('A2_SI12_NRT___0');
          cy.contains('hs3wwlln___1');
        });

      /** Granules **/

      cy.contains('h3', 'Granules only in Cumulus (7)')
        .next()
        .find('.table .tbody')
        .as('cumulusGranulesTable');
      cy.get('@cumulusGranulesTable').find('.tr').its('length').should('be.eq', 7);
      cy.get('@cumulusGranulesTable')
        .within(() => {
          cy.contains('MOD14A1.A4135026.ekHe8x.006.3355759967228');
          cy.contains('MOD14A1.A8959582.q932t8.006.4564896025574');
        });

      cy.contains('h3', 'Granules only in CMR (365)')
        .next()
        .find('.table .tbody')
        .as('cmrGranulesTable');
      cy.get('@cmrGranulesTable').find('.tr').its('length').should('be.eq', 365);
      cy.get('@cmrGranulesTable')
        .within(() => {
          cy.contains('MOD14A1.A0031922.9lenyG.006.4681412227733');
          cy.contains('MOD14A1.A0499025.Bl5XRj.006.7345541650084');
          cy.contains('MOD14A1.A9990408.N4T1Mn.006.9738328377056');
        });

      /** Granule files **/

      cy.contains('h3', 'Granule files only in Cumulus (1)')
        .next()
        .find('.table .tbody')
        .as('cumulusGranulesFilesTable');
      cy.get('@cumulusGranulesFilesTable').find('.tr').its('length').should('be.eq', 1);
      cy.get('@cumulusGranulesFilesTable')
        .children('.tr')
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
        .find('.table .tbody')
        .as('cmrGranulesFilesTable');
      cy.get('@cmrGranulesFilesTable').find('.tr').its('length').should('be.eq', 1);
      cy.get('@cmrGranulesFilesTable')
        .children('.tr')
        .first()
        .within(() => {
          cy.contains('granule.002.5678');
          cy.contains('granule.002.5678.jpg');
          cy.contains('some-bucket');
          cy.contains('a', 'Link')
            .should('have.attr', 'href', 's3://some-bucket/granule__002/granule.002.5678.jpg');
        });
    });
  });
});
