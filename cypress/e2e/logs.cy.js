const collectionName = 'MOD09GQ';
const collectionVersion = '006';
const granuleId = 'MOD09GQ.A0501579.PZB_CG.006.8580266395214';
const executionArn = 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo:b313e777-d28a-435b-a0dd-f1fad08116t1';
const pdr = 'MOD09GQ_1granule_v3.PDR_test-test-src-integration-IngestGranuleDuplicateHandling-1582837549352';
const provider = 's3_provider';

const logSuccess = () => cy.intercept('GET', '/logs?*', {
  fixture: 'logs-success.json',
  statusCode: 200
});

const logError = () => cy.intercept('GET', '/logs?*', {
  fixture: 'logs-error.json',
  statusCode: 400
});

describe('Dashboard Logs', () => {
  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.intercept('GET', '/logs?*').as('getLogs');
    });

    it('should display logs on a Collection page when metrics are configured', () => {
      logSuccess();
      cy.visit(`/collections/collection/${collectionName}/${collectionVersion}`);
      cy.contains('.sidebar li a', 'Logs').should('exist').click();
      cy.url().should('include', '/logs');
      cy.get('.page__section--logs').should('exist');
    });

    it('should not display logs on a Collection page when metrics are not configured', () => {
      logError();
      cy.visit(`/collections/collection/${collectionName}/${collectionVersion}`);
      cy.contains('.sidebar li', 'Logs').should('not.exist');
    });

    it('should display logs on a Granule page when metrics are configured', () => {
      logSuccess();
      cy.visit(`/granules/granule/${granuleId}`);
      cy.get('.page__section--logs', { timeout: 10000 }).should('exist');
    });

    it('should not display logs on a Granule page when metrics are not configured', () => {
      logError();
      cy.visit(`/granules/granule/${granuleId}`);
      cy.get('.page__section--logs', { timeout: 10000 }).should('not.exist');
    });

    it('should display logs on a Granule status pages when metrics are configured', () => {
      logSuccess();
      cy.visit('/granules/completed');
      cy.get('.page__section--logs').should('exist');
      cy.visit('/granules/processing');
      cy.get('.page__section--logs').should('exist');
      cy.visit('/granules/failed');
      cy.get('.page__section--logs').should('exist');
    });

    it('should not display logs on a Granule status pages when metrics are not configured', () => {
      logError();
      cy.visit('/granules/completed');
      cy.get('.page__section--logs').should('not.exist');
      cy.visit('/granules/processing');
      cy.get('.page__section--logs').should('not.exist');
      cy.visit('/granules/failed');
      cy.get('.page__section--logs').should('not.exist');
    });

    it('should display logs on an Execution page when metrics are configured', () => {
      logSuccess();
      cy.visit(`/executions/execution/${executionArn}`);
      cy.contains('.sidebar li', 'Logs').should('exist');
      cy.contains('.meta__row dt', 'Logs').should('exist');
      cy.contains('.meta__row dd a', 'View Execution Logs').should('exist').click();
      cy.url().should('include', '/logs');
    });

    it('should not display logs on an Execution page when metrics are not configured', () => {
      logError();
      cy.visit(`/executions/execution/${executionArn}`);
      cy.contains('.sidebar li', 'Logs').should('not.exist');
      cy.contains('.meta__row dt', 'Logs').should('not.exist');
      cy.contains('.meta__row dd a', 'View Execution Logs').should('not.exist');
    });

    it('should display logs on a PDR page when metrics are configured', () => {
      logSuccess();
      cy.visit(`/pdrs/pdr/${pdr}`);
      cy.get('.page__section--logs').should('exist');
    });

    it('should not display logs on a PDR page when metrics are not configured', () => {
      logError();
      cy.visit(`/pdrs/pdr/${pdr}`);
      cy.get('.page__section--logs').should('not.exist');
    });

    it('should display logs on a Provider page when metrics are configured', () => {
      logSuccess();
      cy.visit(`/providers/provider/${provider}`);
      cy.get('.page__section--logs').should('exist');
    });

    it('should not display logs on a Provider page when metrics are not configured', () => {
      logError();
      cy.visit(`/providers/provider/${provider}`);
      cy.get('.page__section--logs').should('not.exist');
    });
  });
});
