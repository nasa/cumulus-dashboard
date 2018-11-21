import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Executions Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/executions');
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

    it('should display a link to view executions', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href', '#/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      cy.contains('.heading--large', 'Execution Overview');

      // shows a summary count of completed and failed executions
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', '3 Completed')
        .next().contains('li', '1 Failed')
        .next().contains('li', '1 Running');

      // shows a list of executions with IDs and status
      const executionStatusFile = './test/fake-api-fixtures/executions/index.json';
      cy.readFile(executionStatusFile).as('executionStatus');

      cy.get('table tbody tr').as('list');
      cy.get('@list').its('length').should('be.eq', 5);

      // compare data in each row with the data from fixture
      cy.get('@list').each(($el, index, $list) => {
        cy.wrap($el).children().as('rows');
        cy.get('@rows').its('length').should('be.eq', 6);

        cy.get('@executionStatus').its('results').then((executions) => {
          const execution = executions[index];
          cy.get('@rows').eq(0).children('a')
            .should('have.attr', 'href')
            .and('include', execution.arn);
          cy.get('@rows').eq(0).children('a')
            .should('have.attr', 'title')
            .and('be.eq', execution.name);
          cy.get('@rows').eq(1).invoke('text')
            .should('be.eq', execution.status.replace(/^\w/, c => c.toUpperCase()));
          cy.get('@rows').eq(2).invoke('text')
            .should('be.eq', execution.type);
          cy.get('@rows').eq(3).invoke('text')
            .should('match', /.+ago$/);
          cy.get('@rows').eq(4).invoke('text')
            .should('be.eq', `${(Math.round(execution.duration * 100) / 100).toString()}s`);
          cy.get('@rows').eq(5).invoke('text')
            .should('be.eq', execution.collectionId);
        });
      });
    });

    it('should show a single execution', () => {
      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href', '#/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      const executionName = '50eaad71-bba8-4376-83d7-bb9cc1309b92';
      const executionArn = 'arn:aws:states:us-east-1:596205514787:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:50eaad71-bba8-4376-83d7-bb9cc1309b92';
      const stateMachine = 'arn:aws:states:us-east-1:596205514787:stateMachine:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf';
      cy.get('table tbody tr td[class=table__main-asset]').within(() => {
        cy.get(`a[title=${executionName}]`).click({force: true});
      });

      cy.contains('.heading--large', 'Execution');
      cy.contains('.heading--medium', 'Visual workflow');

      cy.get('.table--wrapper')
        .within(() => {
          let i;
          for (i = 26; i < 32; i++) {
            let idMatch = `"id": ${i},`;
            let previousIdMatch = `"previousEventId": ${i - 1}`;

            cy.get(`tr[data-value=${i}]`).children('td').as('items');
            cy.get('@items').eq(0).should('have.text', i.toString());
            cy.get('@items').eq(2).invoke('text').should('match', /\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{2}$/);
            cy.get('@items').eq(3).contains('More Details').click();
            cy.get('@items').eq(3).contains(idMatch).contains(previousIdMatch);
            cy.get('@items').eq(3).contains('Less Details').click();
          }
        });

      cy.get('.status--process')
        .within(() => {
          cy.contains('Execution Status:').next().should('have.text', 'Succeeded');
          cy.contains('Execution Arn:').next().should('have.text', executionArn);
          cy.contains('State Machine Arn:').next().should('have.text', stateMachine);
          cy.contains('Started:').next().invoke('text').should('match', '20:05:10 11/12/18');
          cy.contains('Ended:').next().invoke('text').should('match', '20:05:31 11/12/18');
          cy.contains('Logs:').next()
            .within(() => {
              cy.get('a').should('have.attr', 'href', `#/executions/execution/${executionName}/logs`).click();
            });
        });

      cy.contains('.heading--large', `Logs for Execution ${executionName}`);
      cy.get('div[class=status--process] h2').first()
        .should('have.text', 'Execution Details:').next().as('headingSection');
      cy.get('@headingSection')
        .contains('"stack": "test-source-integration",')
        .contains('"count": 28');
    });
  });
});
