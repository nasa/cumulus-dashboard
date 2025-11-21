import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Operations page', () => {
  it('when not logged in it should redirect to login page', () => {
    cy.visit('/operations');
    shouldBeRedirectedToLogin();
  });

  describe('when logged in', () => {
    const testAsyncId = '452e8941-9d18-4c40-9962-2ff38c179a39';
    const testDescription = 'Bulk granule deletion';
    const testType = 'Bulk Granule Delete';
    const testStatus = 'Succeeded';

    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
    });

    it('should display a link to view operations', () => {
      cy.visit('/');
      cy.get('nav').contains('Operations');
    });

    it('should display a list of operations', () => {
      cy.visit('/');
      cy.get('nav').contains('Operations').click();
      cy.url().should('include', '/operations');
      cy.get('.table .tbody .tr').should('have.length', 8);
      cy.contains('.table .tr', testAsyncId)
        .within(() => {
          cy.contains(testDescription);
          cy.contains(testType);
          cy.contains(testAsyncId);
          cy.contains(testStatus);
        });
    });

    it('Should update URL when search filter is changed.', () => {
      const search = '452e';
      cy.visit('/operations');
      cy.get('.search').as('search');
      cy.get('@search').click().type(search);
      cy.url().should('include', `search=${search}`);
      cy.get('.table .tbody .tr').should('have.length', 1);
    });

    it('should handle null output gracefully for RUNNING operations', () => {
      cy.visit('/operations');
      const runningId = '58397019-81fb-464a-bc76-0ad0490fdeec';
      cy.contains('.table .tr', runningId)
        .within(() => {
          cy.get('p').should('not.exist');
          cy.get('.error__report').should('not.exist');
        });
    });

    it('should display JSON output for SUCCEEDED operations', () => {
      cy.visit('/operations');
      cy.contains('.table .tr', testAsyncId)
        .within(() => {
          cy.get('p').should('exist');
          cy.get('.error__report').should('not.exist');
        });
    });

    it('should display ErrorReport for TASK_FAILED operations', () => {
      cy.visit('/operations');
      const taskFailedId = 'c81fa7ad-d83b-4ed0-bfbf-fca16a329836';
      cy.contains('.table .tr', taskFailedId)
        .within(() => {
          cy.get('.error__report').should('exist');
        });
    });

    it('should display ErrorReport for RUNNER_FAILED operations', () => {
      cy.visit('/operations');
      const runnerFailedId = '1783f739-742d-4095-9283-3f65f37b2a7e';
      cy.contains('.table .tr', runnerFailedId)
        .within(() => {
          cy.get('.error__report').should('exist');
        });
    });

    it('should show a single operation', () => {
      const operationId = '17907019-81fb-464a-bc76-0ad0490fdeec';
      const operationDescription = 'Create Reconciliation Report';
      const operationType = 'Reconciliation Report';
      const operationStatus = 'Succeeded';
      const taskArn = 'arn:aws:ecs:us-east-1:123456789012:task/a5bea509-a6d4-4bba-b64a-01477b413c5f';

      cy.fixture('seeds/asyncOperationsFixture.json').then((fixture) => {
        const operation = fixture.results.find(op => op.id === operationId);
        cy.intercept(
          { method: 'GET', url: `http://localhost:5001/asyncOperations/${operationId}` },
          { body: operation, statusCode: 200 }
        ).as('getOperation');
      });

      cy.visit('/operations');
      cy.contains('.table .tbody .tr', operationId)
        .find(`a[title="${operationId}"]`)
        .click({ force: true });

      cy.wait('@getOperation');
      cy.url().should('include', `/operations/operation/${operationId}`);
      cy.contains('.heading--large', `Async Operation: ${operationId}`);

      cy.get('.operation__content')
        .within(() => {
          cy.contains('ID').next().should('have.text', operationId);
          cy.contains('Status').next().should('have.text', operationStatus);
          cy.contains('Operation Type').next().should('have.text', operationType);
          cy.contains('Description').next().should('have.text', operationDescription);
          cy.contains('Task ARN').next().should('have.text', taskArn);
          cy.contains('Output').next().should('contain', 'Show Output');
        });
    });

    it('should show output modal for operation', () => {
      const operationId = '17907019-81fb-464a-bc76-0ad0490fdeec';
      const expectedOutput = {
        createdAt: 1600888528207,
        location: 's3://cumulus-test-sandbox-internal/test-source-integration/reconciliation-reports/InternalReportc89bf1d37c.json',
        name: 'InternalReportc89bf1d37c',
        updatedAt: 1600888542261,
        type: 'Internal',
        status: 'Generated'
      };

      cy.fixture('seeds/asyncOperationsFixture.json').then((fixture) => {
        const operation = fixture.results.find(op => op.id === operationId);
        cy.intercept(
          { method: 'GET', url: `http://localhost:5001/asyncOperations/${operationId}` },
          { body: operation, statusCode: 200 }
        ).as('getOperation');
      });

      cy.visit(`/operations/operation/${operationId}`);
      cy.wait('@getOperation');

      cy.contains('Output').next().contains('button', 'Show Output').click();
      cy.get('.operation__modal').should('exist');
      cy.get('.operation__modal .modal-title').should('contain', 'Operation Output');
      cy.get('.operation__modal').find('pre').then(($content) => {
        const parsedContent = JSON.parse($content.text());
        expect(parsedContent).to.deep.equal(expectedOutput);
      });
      cy.get('.button--close').click();
      cy.get('.operation__modal').should('not.exist');
    });

    it('should show output modal with download button', () => {
      const operationId = '17907019-81fb-464a-bc76-0ad0490fdeec';

      cy.fixture('seeds/asyncOperationsFixture.json').then((fixture) => {
        const operation = fixture.results.find(op => op.id === operationId);
        cy.intercept(
          { method: 'GET', url: `http://localhost:5001/asyncOperations/${operationId}` },
          { body: operation, statusCode: 200 }
        ).as('getOperation');
      });

      cy.visit(`/operations/operation/${operationId}`);
      cy.wait('@getOperation');

      cy.contains('Output').next().contains('button', 'Show Output').click();
      cy.get('.operation__modal').should('exist');
      cy.get('.operation__modal .modal-title').within(() => {
        cy.contains('Operation Output');
        cy.get('a.button--download').should('exist').should('have.attr', 'download', 'output.json');
      });
      cy.get('.button--close').click();
    });

    it('should navigate back to operations list from operation detail page', () => {
      const operationId = '17907019-81fb-464a-bc76-0ad0490fdeec';

      cy.fixture('seeds/asyncOperationsFixture.json').then((fixture) => {
        const operation = fixture.results.find(op => op.id === operationId);
        cy.intercept(
          { method: 'GET', url: `http://localhost:5001/asyncOperations/${operationId}` },
          { body: operation, statusCode: 200 }
        ).as('getOperation');
      });

      cy.visit(`/operations/operation/${operationId}`);
      cy.wait('@getOperation');

      cy.contains('.sidebar__nav--back', 'Back to Operations').click();
      cy.url().should('include', '/operations');
      cy.url().should('not.include', `/operation/${operationId}`);
    });

    it('should display breadcrumbs correctly on operation detail page', () => {
      const operationId = '17907019-81fb-464a-bc76-0ad0490fdeec';

      cy.fixture('seeds/asyncOperationsFixture.json').then((fixture) => {
        const operation = fixture.results.find(op => op.id === operationId);
        cy.intercept(
          { method: 'GET', url: `http://localhost:5001/asyncOperations/${operationId}` },
          { body: operation, statusCode: 200 }
        ).as('getOperation');
      });

      cy.visit(`/operations/operation/${operationId}`);
      cy.wait('@getOperation');

      cy.get('.breadcrumb').within(() => {
        cy.contains('Dashboard Home');
        cy.contains('Operations');
        cy.contains('Operation Details');
      });
    });
  });
});
