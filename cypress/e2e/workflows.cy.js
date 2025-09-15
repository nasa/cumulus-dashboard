import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Workflows Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/workflows');
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    before(() => {
      cy.task('resetState');
      cy.visit('/');
    });

    beforeEach(() => {
      cy.login();
    });

    it('displays a link to view workflows', () => {
      cy.visit('/');
      cy.contains('nav li a', 'Workflows').as('workflows');
      cy.get('@workflows').should('have.attr', 'href', '/workflows');
      cy.get('@workflows').click();

      cy.url().should('include', 'workflows');
      cy.contains('.heading--xlarge', 'Workflows');
    });

    it('displays a list of workflows', () => {
      cy.visit('/workflows');
      cy.get('.table .tbody .tr').should('have.length', 2);
      cy.contains('.table .tbody .tr a', 'HelloWorldWorkflow')
        .should('have.attr', 'href', '/workflows/workflow/HelloWorldWorkflow');
      cy.contains('.table .tbody .tr a', 'SecondTestWorkflow')
        .should('have.attr', 'href', '/workflows/workflow/SecondTestWorkflow');
    });

    it('displays a link to individual workflow', () => {
      const workflowName = 'HelloWorldWorkflow';
      cy.visit('/workflows');

      cy.url().should('include', 'workflows');
      cy.contains('.heading--xlarge', 'Workflows');

      cy.contains('.table .tbody .tr a', workflowName)
        .should('have.attr', 'href', `/workflows/workflow/${workflowName}`)
        .click();

      cy.contains('.heading--large', workflowName);
      /* eslint-disable no-template-curly-in-string */
      cy.getJsonTextareaValue().then((workflowJson) => {
        expect(workflowJson.name).to.equal(workflowName);
        expect(workflowJson.definition.States.StartStatus)
          .to.deep.equal({ Type: 'Task', Resource: '${SfSnsReportLambdaAliasOutput}', Next: 'StopStatus' });
      });
      /* eslint-enable no-template-curly-in-string */
    });

    it('filters workflows when a user types in the search box', () => {
      cy.intercept('GET', '/workflows*').as('get-workflows');
      cy.visit('/workflows');
      cy.get('.table .tbody .tr').should('have.length', 2);
      cy.get('.table .tbody .tr').first().contains('HelloWorldWorkflow');
      cy.get('.search').click().type('condtes');
      cy.get('.table .tbody .tr').should('have.length', 1);
      cy.get('.table .tbody .tr').first().contains('SecondTestWorkflow');
    });

    it('filters workflows when a user comes to the page with a search query', () => {
      cy.intercept('GET', '/workflows*').as('get-workflows');
      cy.visit('/workflows?search=condtes');
      cy.get('.table .tbody .tr').should('have.length', 1);
      cy.get('.table .tbody .tr').first().contains('SecondTestWorkflow');
    });
  });
});
