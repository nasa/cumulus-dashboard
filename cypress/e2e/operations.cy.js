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
  });
});
