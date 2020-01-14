import { shouldBeRedirectedToLogin } from '../support/assertions';
import { fullDate } from '../../app/src/js/utils/format';

describe('Dashboard Executions Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/executions');
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    before(() => cy.visit('/'));
    beforeEach(() => {
      cy.task('resetState');
      cy.login();
      cy.visit('/');
    });

    it('should visit the link to view executions', () => {
      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href', '#/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      cy.contains('.heading--large', 'Execution Overview');

      // shows a summary count of completed and failed executions
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', '10 Completed')
        .next().contains('li', '3 Failed')
        .next().contains('li', '3 Running');
    });

    it('should display the correct executions with Ids and status ', () => {
      cy.visit('#/executions');
      cy.getFakeApiFixture('executions').as('executionsFixture');
      cy.get('@executionsFixture').its('results')
        .each((execution) => {
          const visiblePart = execution['name'].split('-').slice(0,3).join('-');
          cy.contains(visiblePart);
          cy.get(`[data-value="${execution['name']}"]`).children().as('columns');
          cy.get('@columns').its('length').should('be.eq', 6);

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

      cy.get('table tbody tr').as('list');
      cy.get('@list').its('length').should('be.eq', 6);

    });

    // TODO [MHS, 2020-01-14] This will probably need mocked. but not sure.
    it.skip('should show a single execution', () => {
      cy.visit('#/executions');
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

      const startMatch = fullDate('2018-11-12T20:05:10.401Z');
      const endMatch = fullDate('2018-11-12T20:05:31.536Z');

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

      cy.getFakeApiFixture(`executions/status/${executionName}`).as('executionStatus');

      cy.get('@executionStatus').its('executionHistory').its('events').then((events) => {
        cy.get('@events').each(($el, index, $list) => {
          let timestamp = fullDate(events[index].timestamp);
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

    // TODO [MHS, 2020-01-14]
    it.skip('should show logs for a single execution', () => {
      const executionName = '50eaad71-bba8-4376-83d7-bb9cc1309b92';
      const executionArn = 'arn:aws:states:us-east-1:596205514787:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:50eaad71-bba8-4376-83d7-bb9cc1309b92';

      cy.getFakeApiFixture(`executions/logs/${executionName}`).as('executionLogs');

      cy.visit(`/#/executions/execution/${executionArn}`);
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

    // TODO [MHS, 2020-01-14]
    it.skip('should show an execution with limited information', () => {
      const executionName = 'b313e777-d28a-435b-a0dd-f1fad08116t1';
      const executionArn = 'arn:aws:states:us-east-1:596205514787:execution:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo:b313e777-d28a-435b-a0dd-f1fad08116t1';
      const stateMachine = 'arn:aws:states:us-east-1:596205514787:stateMachine:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo';
      cy.visit(`/#/executions/execution/${executionArn}`);

      cy.contains('.heading--large', 'Execution');
      cy.contains('.heading--medium', 'Visual workflow').should('not.exist');

      const startMatch = fullDate('2018-12-06T19:18:11.174Z');
      const endMatch = fullDate('2018-12-06T19:18:41.145Z');

      cy.getFakeApiFixture(`executions/status/${executionName}`).as('executionStatus');

      cy.get('.status--process')
        .within(() => {
          cy.contains('Execution Status:').next().should('have.text', 'Succeeded');
          cy.contains('Execution Arn:').next().should('have.text', executionArn);
          cy.contains('State Machine Arn:').next().should('have.text', stateMachine);
          cy.contains('Started:').next().should('have.text', startMatch);
          cy.contains('Ended:').next().should('have.text', endMatch);

          cy.get('@executionStatus').its('execution').then((execution) => {
            cy.contains('Input:').next().find('pre').then(($content) =>
                                                          // parse and stringify JSON string to get the same format as in the fixture
                                                          expect(JSON.stringify(JSON.parse($content.text()))).to.eq(execution.input));

            cy.contains('Input:').next().contains('.Collapsible', 'Show Input').click('topLeft');
            cy.contains('Input:').next().contains('.Collapsible', 'Hide Input');

            cy.contains('Output:').next().find('pre').then(($content) =>
                                                           expect(JSON.stringify(JSON.parse($content.text()))).to.eq(execution.output));

            cy.contains('Output:').next().contains('.Collapsible', 'Show Output').click('topLeft');
            cy.contains('Output:').next().contains('.Collapsible', 'Hide Output');
          });

          cy.contains('Logs:').next()
            .within(() => {
              cy.get('a').should('have.attr', 'href', `#/executions/execution/${executionName}/logs`);
            });
        });

      cy.contains('.heading--medium', 'Events').should('not.exist');
    });
  });
});
