import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Operations page', () => {
  it('when not logged in it should redirect to login page', () => {
    cy.visit('/operations');
    shouldBeRedirectedToLogin();
  });

  describe('when logged in', {testIsolation: false}, () => {
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
      cy.get('.table .tbody .tr').should('have.length', 7);
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
  });
});
