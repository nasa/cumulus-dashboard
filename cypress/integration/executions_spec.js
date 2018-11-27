import { shouldBeRedirectedToLogin } from '../support/assertions';
const moment = require('moment');

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
         // columns in the row
        cy.wrap($el).children().as('columns');
        cy.get('@columns').its('length').should('be.eq', 6);

        cy.get('@executionStatus').its('results').then((executions) => {
          const execution = executions[index];
          cy.get('@columns').eq(0).children('a')
            .should('have.attr', 'href')
            .and('include', execution.arn);
          cy.get('@columns').eq(0).children('a')
            .should('have.attr', 'title')
            .and('be.eq', execution.name);
          cy.get('@columns').eq(1).invoke('text')
            .should('be.eq', execution.status.replace(/^\w/, c => c.toUpperCase()));
          cy.get('@columns').eq(2).invoke('text')
            .should('be.eq', execution.type);
          cy.get('@columns').eq(3).invoke('text')
            .should('match', /.+ago$/);
          cy.get('@columns').eq(4).invoke('text')
            .should('be.eq', `${Number(execution.duration.toFixed(2))}s`);
          cy.get('@columns').eq(5).invoke('text')
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

      const startMatch = moment('2018-11-12T20:05:10.401Z').format('kk:mm:ss MM/DD/YY');
      const endMatch = moment('2018-11-12T20:05:31.536Z').format('kk:mm:ss MM/DD/YY');

      cy.get('.status--process')
      .within(() => {
        cy.contains('Execution Status:').next().should('have.text', 'Succeeded');
        cy.contains('Execution Arn:').next().should('have.text', executionArn);
        cy.contains('State Machine Arn:').next().should('have.text', stateMachine);
        cy.contains('Started:').next().should('have.text', startMatch);
        cy.contains('Ended:').next().should('have.text', endMatch);
      });
      cy.get('table tbody tr').as('events');
      cy.get('@events').its('length').should('be.eq', 7);

      const executionStatusFile = `./test/fake-api-fixtures/executions/status/${executionArn}/index.json`;
      cy.readFile(executionStatusFile).as('executionStatus');

      cy.get('@executionStatus').its('executionHistory').its('events').then((events) => {
        cy.get('@events').each(($el, index, $list) => {
          let timestamp = moment(events[index].timestamp).format('kk:mm:ss MM/DD/YY');
          cy.wrap($el).children('td').as('columns');
          cy.get('@columns').its('length').should('be.eq', 4);
          let idMatch = `"id": ${index + 1},`;
          let previousIdMatch = `"previousEventId": ${index}`;

          cy.get('@columns').eq(0).should('have.text', (index + 1).toString());
          cy.get('@columns').eq(2).should('have.text', timestamp);
          cy.get('@columns').eq(3).contains('More Details').click();
          cy.get('@columns').eq(3).contains(idMatch);
          if (index !== 0) {
            cy.get('@columns').eq(3).contains(previousIdMatch);
          }
          cy.get('@columns').eq(3).contains('Less Details').click();
        });
      });
    });

    it('should show logs for a single execution', () => {
      cy.contains('nav li a', 'Executions').click();
      cy.contains('.heading--xlarge', 'Executions');
      const executionName = '50eaad71-bba8-4376-83d7-bb9cc1309b92';
      const executionLogsFile = `./test/fake-api-fixtures/executions/logs/${executionName}/index.json`;
      cy.readFile(executionLogsFile).as('executionLogs');

      cy.get('table tbody tr td[class=table__main-asset]').within(() => {
        cy.get(`a[title=${executionName}]`).click({force: true});
      });
      cy.contains('.heading--large', 'Execution');

      cy.get('.status--process')
      .within(() => {
        cy.contains('Logs:').next()
          .within(() => {
            cy.get('a').should('have.attr', 'href', `#/executions/execution/${executionName}/logs`).click();
          });
      });

      cy.contains('.heading--large', `Logs for Execution ${executionName}`);
      cy.get('div[class=status--process]').as('sections');
      cy.get('@executionLogs').its('meta').then((meta) => {
        cy.get('@sections').eq(0).within(() => {
          cy.get('h2').should('have.text', 'Execution Details:');
          cy.get('pre')
            .contains(meta.name)
            .contains(meta.stack)
            .contains(meta.table)
            .contains(meta.count);
        });
      });
      cy.get('@executionLogs').its('results').then((logs) => {
        cy.get('@sections').eq(1).within(() => {
          cy.get('pre').contains(JSON.stringify(logs[0].message));
        });
      });
    });
  });
});
