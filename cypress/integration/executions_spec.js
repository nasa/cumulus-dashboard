import { shouldBeRedirectedToLogin } from '../support/assertions';
import { fullDate } from '../../app/src/js/utils/format';

describe('Dashboard Executions Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/executions');
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

    it('should visit the link to view executions', () => {
      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href', '/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      cy.contains('.heading--large', 'Execution Overview');

      // shows a summary count of completed and failed executions
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 4)
        .next().contains('li', 'Failed').contains('li', 1)
        .next().contains('li', 'Running').contains('li', 1);
    });

    it('should display the correct executions with Ids and status ', () => {
      cy.visit('/executions');
      cy.getFakeApiFixture('executions').as('executionsFixture');
      cy.get('@executionsFixture').its('results')
        .each((execution) => {
          const visiblePart = execution['name'].split('-').slice(0, 3).join('-');
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

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').its('length').should('be.eq', 6);
    });

    it('should show a single execution', () => {
      const executionName = '8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const stateMachine = 'arn:aws:states:us-east-1:012345678901:stateMachine:test-stack-HelloWorldWorkflow';

      cy.server();
      cy.visit('/executions');
      cy.route({
        method: 'GET',
        url: `http://localhost:5001/executions/status/${executionArn}`,
        response: 'fixture:valid-execution.json',
        status: 200
      });

      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href', '/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      cy.get('.table .tbody .tr .td.table__main-asset').within(() => {
        cy.get(`a[title=${executionName}]`).click({force: true});
      });

      cy.contains('.heading--large', 'Execution');
      cy.contains('.heading--medium', 'Visual workflow');

      cy.get('.status--process')
        .within(() => {
          cy.contains('Execution Status:').next().should('have.text', 'Succeeded');
          cy.contains('Execution Arn:').next().should('have.text', executionArn);
          cy.contains('State Machine Arn:').next().should('have.text', stateMachine);
          cy.contains('Started:').next().should('have.text', fullDate('2019-12-13T15:16:46.753Z'));
          cy.contains('Ended:').next().should('have.text', fullDate('2019-12-13T15:16:52.582Z'));
        });

      cy.get('.table .tbody .tr').as('events');
      cy.get('@events').its('length').should('be.eq', 7);

      cy.getFixture('valid-execution').as('executionStatus');
      cy.get('@executionStatus').its('executionHistory').its('events').then((events) => {
        cy.get('@events').each(($el, index, $list) => {
          let timestamp = fullDate(events[index].timestamp);
          cy.wrap($el).children('.td').as('columns');
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
      const executionName = '8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';

      cy.server();
      cy.route({
        method: 'GET',
        url: `http://localhost:5001/executions/status/${executionArn}`,
        response: 'fixture:valid-execution.json',
        status: 200
      });
      cy.route({
        method: 'GET',
        url: `http://localhost:5001/logs/${executionName}`,
        response: 'fixture:execution-logs.json',
        status: 200
      });

      cy.visit(`/executions/execution/${executionArn}`);
      cy.contains('.heading--large', 'Execution');

      cy.get('.status--process')
        .within(() => {
          cy.contains('Logs:').next()
            .within(() => {
              cy.get('a').should('have.attr', 'href', `/executions/execution/${executionName}/logs`).click();
            });
        });

      cy.contains('.heading--large', `Logs for Execution ${executionName}`);
      cy.get('div[class=status--process]').as('sections');

      cy.getFixture('execution-logs').its('meta').then((meta) => {
        cy.get('@sections').eq(0).within(() => {
          cy.get('h2').should('have.text', 'Execution Details:');
          cy.get('pre')
            .contains(meta.name)
            .contains(meta.stack)
            .contains(meta.table)
            .contains(meta.count);
        });
      });
      cy.getFixture('execution-logs').its('results').then((logs) => {
        cy.get('@sections').eq(1).within(() => {
          cy.get('pre').contains(JSON.stringify(logs[0].message));
        });
      });
    });

    it('should show an execution with limited information', () => {
      const executionName = 'b313e777-d28a-435b-a0dd-f1fad08116t1';
      const executionArn = 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo:b313e777-d28a-435b-a0dd-f1fad08116t1';
      const stateMachine = 'arn:aws:states:us-east-1:123456789012:stateMachine:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo';

      cy.server();
      cy.route({
        method: 'GET',
        url: `http://localhost:5001/logs/${executionName}`,
        response: 'fixture:limited-execution.json',
        status: 200
      });

      cy.visit(`/executions/execution/${executionArn}`);

      cy.contains('.heading--large', 'Execution');
      cy.contains('.heading--medium', 'Visual workflow').should('not.exist');

      const startMatch = fullDate('2018-12-06T19:18:11.174Z');
      const endMatch = fullDate('2018-12-06T19:18:41.145Z');

      cy.get('.status--process')
        .within(() => {
          cy.contains('Execution Status:').next().should('have.text', 'Succeeded');
          cy.contains('Execution Arn:').next().should('have.text', executionArn);
          cy.contains('State Machine Arn:').next().should('have.text', stateMachine);
          cy.contains('Started:').next().should('have.text', startMatch);
          cy.contains('Ended:').next().should('have.text', endMatch);

          cy.getFakeApiFixture('executions').as('executionsFixture');
          cy.get('@executionsFixture').its('results')
            .each((execution) => {
              if (execution.name === executionName) {
                cy.contains('Input:').next().find('pre')
                  .then(($content) =>
                    expect(JSON.parse($content.text())).to.deep.equal(execution.originalPayload));
                cy.contains('Input:').next().contains('.Collapsible', 'Show Input').click('topLeft');
                cy.contains('Input:').next().contains('.Collapsible', 'Hide Input');

                cy.contains('Output:').next().find('pre')
                  .then(($content) =>
                    expect(JSON.parse($content.text())).to.deep.equal(execution.finalPayload));

                cy.contains('Output:').next().contains('.Collapsible', 'Show Output').click('topLeft');
                cy.contains('Output:').next().contains('.Collapsible', 'Hide Output');
              }
            });

          cy.contains('Logs:').next()
            .within(() => {
              cy.get('a').should('have.attr', 'href', `/executions/execution/${executionName}/logs`);
            });
        });

      cy.contains('.heading--medium', 'Events').should('not.exist');
    });
  });
});
