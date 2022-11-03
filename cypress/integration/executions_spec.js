import { shouldBeRedirectedToLogin } from '../support/assertions';
import { displayCase, fullDate } from '../../app/src/js/utils/format';

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
      cy.contains('.heading--large', 'Executions Overview');

      // shows a summary count of completed and failed executions
      cy.get('.overview-num__wrapper ul li')
        .first().contains('li', 'Completed').contains('li', 6)
        .next()
        .contains('li', 'Failed')
        .contains('li', 2)
        .next()
        .contains('li', 'Running')
        .contains('li', 1);
    });

    it('should display the correct executions with Ids and status ', () => {
      cy.visit('/executions');
      cy.getFakeApiFixture('executions').as('executionsFixture');
      cy.get('@executionsFixture').its('results')
        .each((execution) => {
          const visiblePart = execution.name.split('-').slice(0, 3).join('-');
          cy.contains(visiblePart);
          cy.get(`[data-value="${execution.name}"]`).children().as('columns');
          cy.get('@columns').should('have.length', 7);

          cy.get('@columns').eq(0).children('a')
            .should('have.attr', 'href')
            .and('include', execution.arn);
          cy.get('@columns').eq(0).children('a')
            .should('have.attr', 'title')
            .and('be.eq', execution.name);
          cy.get('@columns').eq(1).invoke('text')
            .should('contain', displayCase(execution.status));
          cy.get('@columns').eq(2).invoke('text')
            .should('be.eq', execution.type);
          cy.get('@columns').eq(3).invoke('text')
            .should('match', /..+[0-9]{2}\/[0-9]{2}\/[0-9]{2}$/);
          cy.get('@columns').eq(4).invoke('text')
            .should('be.eq', `${Number(execution.duration).toFixed(2)}s`);
          cy.get('@columns').eq(5).invoke('text')
            .should('be.eq', execution.collectionId || '--');
          cy.get('@columns').eq(6).within(() => {
            cy.get('.button__row--download').should('have.length', 1);
          });
        });

      cy.get('.table .tbody .tr').as('list');
      cy.get('@list').should('have.length', 9);
    });

    it('should show a single execution', () => {
      const executionName = '8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const stateMachine = 'arn:aws:states:us-east-1:012345678901:stateMachine:test-stack-HelloWorldWorkflow';

      cy.visit('/executions');
      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${executionArn}` },
        { fixture: 'valid-execution.json', statusCode: 200 }
      );

      cy.contains('nav li a', 'Executions').as('executions');
      cy.get('@executions').should('have.attr', 'href').and('include', '/executions');
      cy.get('@executions').click();

      cy.url().should('include', 'executions');
      cy.contains('.heading--xlarge', 'Executions');
      cy.get('.table .tbody .tr .td.table__main-asset').within(() => {
        cy.get(`a[title=${executionName}]`).click({ force: true });
      });

      cy.contains('.heading--large', 'Execution');
      cy.get('.button--download').should('have.length', 1);
      cy.contains('.heading--medium', 'Visual');

      cy.get('.status--process')
        .within(() => {
          cy.contains('Execution Status').next().should('have.text', 'Succeeded');
          cy.contains('Execution Arn').next().should('have.text', executionArn);
          cy.contains('State Machine Arn').next().should('have.text', stateMachine);
          cy.contains('Started').next().should('have.text', fullDate('2019-12-13T15:16:46.753Z'));
          cy.contains('Ended').next().should('have.text', fullDate('2019-12-13T15:16:52.582Z'));
        });
    });

    it('should show logs for a single execution', () => {
      const executionName = '8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${executionArn}` },
        { fixture: 'valid-execution.json', statusCode: 200 }
      );

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/logs/${executionName}` },
        { fixture: 'execution-logs.json', statusCode: 200 }
      );

      cy.intercept(
        { method: 'GET', url: 'http://localhost:5001/logs?*' },
        { fixture: 'logs-success.json', statusCode: 200 }
      );

      cy.visit(`/executions/execution/${executionArn}`);
      cy.contains('.heading--large', 'Execution');

      cy.get('.status--process')
        .within(() => {
          cy.contains('Logs').next()
            .within(() => {
              cy.get('a').should('have.attr', 'href', `/executions/execution/${executionArn}/logs`).click();
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
          cy.get('pre').contains(JSON.stringify(logs[0].app_message));
        });
      });
    });

    it('should show an events page for a single execution', () => {
      const executionName = '8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${executionArn}` },
        { fixture: 'valid-execution.json', statusCode: 200 }
      );

      cy.visit(`/executions/execution/${executionArn}`);
      cy.contains('.heading--large', 'Execution');

      cy.contains('div ul li a', 'Events')
        .should('have.attr', 'href', `/executions/execution/${executionArn}/events`).click();

      cy.contains('.heading--large', executionName);
      cy.contains('.num-title', 7);

      cy.get('.table .thead .tr .th').as('columnHeaders');
      cy.get('@columnHeaders').eq(0).should('contain.text', 'Event ID');
      cy.get('@columnHeaders').eq(1).should('contain.text', 'Step Name');
      cy.get('@columnHeaders').eq(2).should('contain.text', 'Timestamp');

      cy.get('.table .tbody .tr').as('events');
      cy.get('@events').should('have.length', 7);

      cy.getFixture('valid-execution').as('executionStatus');
      cy.get('@executionStatus').its('data.executionHistory').its('events').then((events) => {
        let prevStepName;
        cy.get('@events').each(($el, index, $list) => {
          const timestamp = fullDate(events[index].timestamp);
          cy.wrap($el).children('.td').as('columns');
          cy.get('@columns').should('have.length', 3);
          const id = index + 1;
          const idMatch = `"id": ${id},`;
          const previousIdMatch = `"previousEventId": ${index}`;
          prevStepName = ((index === 0 || !events[index].type.match('LambdaFunction'))
            ? 'N/A'
            : (events[index - 1].name || prevStepName));
          const stepColumnText = events[index].name || prevStepName;
          cy.get('@columns').eq(0).should('have.text', (index + 1).toString());
          cy.get('@columns').eq(1).should('have.text', stepColumnText);
          cy.get('@columns').eq(1).children('i')
            .should('have.class', 'fa-check-circle')
            .should('have.class', 'status-icon--success');
          cy.get('@columns').eq(2).should('have.text', timestamp);
          cy.get('.execution__modal').should('not.exist');
          cy.get('@columns').eq(1).children('span').click();
          cy.get('.execution__modal').should('exist');
          const stepType = events[index].type;
          cy.get('.execution__modal .modal-title').contains(`ID ${id}: ${stepColumnText} - ${stepType}`);
          cy.get('.execution__modal .modal-body').contains(idMatch);
          if (index !== 0) {
            cy.get('.execution__modal .modal-body').contains(previousIdMatch);
          }
          cy.contains('.execution__modal .button', 'Close').click();
        });
      });
    });

    it('should show the correct status icon for each step', () => {
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${executionArn}` },
        { fixture: 'valid-execution-with-failure.json', statusCode: 200 }
      );

      cy.visit(`/executions/execution/${executionArn}`);

      cy.contains('div ul li a', 'Events').click();

      cy.get('.table .thead .tr .th').as('columnHeaders');

      cy.get('.table .tbody .tr').as('events');
      cy.get('@events').should('have.length', 7);

      cy.getFixture('valid-execution-with-failure').as('executionStatus');
      cy.get('@executionStatus').its('data.executionHistory').its('events').then((events) => {
        cy.get('@events').each(($el, index, $list) => {
          cy.wrap($el).children('.td').as('columns');
          if (events[index].type.toLowerCase().includes('failed')) {
            cy.get('@columns').eq(1).children('i')
              .should('have.class', 'fa-times-circle')
              .should('have.class', 'status-icon--failed');
          } else {
            cy.get('@columns').eq(1).children('i')
              .should('have.class', 'fa-check-circle')
              .should('have.class', 'status-icon--success');
          }
        });
      });
    });

    it('should correctly handle searching execution events', () => {
      const executionName = '8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${executionArn}` },
        { fixture: 'valid-execution.json', statusCode: 200 }
      );
      cy.visit(`/executions/execution/${executionArn}/events`);

      cy.contains('.heading--large', executionName);
      cy.contains('.num-title', 7);

      cy.get('.table .tbody .tr').as('events');
      cy.get('@events').should('have.length', 7);

      cy.get('.search').as('search');
      cy.get('@search').click().type('task');
      cy.url().should('include', 'search=task');
      cy.get('@events').should('have.length', 2);
      cy.get('@search').clear();
      cy.url().should('not.include', 'search');
      cy.get('@events').should('have.length', 7);

      //  test that initial search value works
      cy.visit('/');
      cy.visit(`/executions/execution/${executionArn}/events?search=task`);
      cy.get('@events').should('have.length', 2);
    });

    it('should show an execution with limited information', () => {
      const executionName = 'b313e777-d28a-435b-a0dd-f1fad08116t1';
      const executionArn = 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo:b313e777-d28a-435b-a0dd-f1fad08116t1';
      const stateMachine = 'arn:aws:states:us-east-1:123456789012:stateMachine:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo';
      const granuleId = 'MOD09GQ.A9344328.K9yI3O.006.4625818663028';

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/logs/${executionName}` },
        { fixture: 'limited-execution.json', statusCode: 200 }
      );

      cy.intercept(
        { method: 'GET', url: 'http://localhost:5001/logs?*' },
        { fixture: 'logs-success.json', statusCode: 200 }
      );

      cy.visit(`/executions/execution/${executionArn}`);

      cy.contains('.heading--large', 'Execution');
      cy.contains('.heading--medium', 'Visual').should('not.exist');

      const startMatch = fullDate('2018-12-06T19:18:11.174Z');
      const endMatch = fullDate('2018-12-06T19:18:41.145Z');

      cy.get('.status--process')
        .within(() => {
          cy.contains('Execution Status').next().should('have.text', 'Succeeded');
          cy.contains('Execution Arn').next().should('have.text', executionArn);
          cy.contains('State Machine Arn').next().should('have.text', stateMachine);
          cy.contains('Started').next().should('have.text', startMatch);
          cy.contains('Ended').next().should('have.text', endMatch);
          cy.contains('Parent Workflow Execution').next().should('have.text', 'N/A');
        });

      cy.get('.table .thead .th').eq(0).contains('Granule ID');
      cy.get('.table .thead .th').eq(1).contains('Associated Executions List');

      cy.get('.table .tbody .td').eq(0).contains(granuleId);
      cy.get('.table .tbody .td').eq(1).contains('Link');

      cy.getFakeApiFixture('executions').as('executionsFixture');
      cy.get('@executionsFixture').its('results')
        .each((execution) => {
          if (execution.name === executionName) {
            cy.contains('Input').next().contains('button', 'Show Input').click();
            cy.get('.execution__modal').find('pre').then(($content) => expect(JSON.parse($content.text())).to.deep.equal(execution.originalPayload));
            cy.get('.button--close').click();

            cy.contains('Output').next().contains('button', 'Show Output').click();
            cy.get('.execution__modal').find('pre').then(($content) => expect(JSON.parse($content.text())).to.deep.equal(execution.finalPayload));
            cy.get('.button--close').click();
          }
        });

      cy.contains('dt', 'Logs').next()
        .within(() => {
          cy.get('a').should('have.attr', 'href', `/executions/execution/${executionArn}/logs`);
        });
    });

    it('should navigate to to executions-list when Associated Executions List link is clicked on execution detail page', () => {
      const executionArn = 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo:b313e777-d28a-435b-a0dd-f1fad08116t1';

      cy.intercept('http://localhost:5001/executions/status/*', (req) => {
        // Remove the header that will allow caching of the request
        delete req.headers['if-none-match'];
      }).as('execution-status');

      cy.visit(`/executions/execution/${executionArn}`);

      cy.wait('@execution-status').as('response');

      // validate Associated Executions List link contains correct parameters
      cy.get('@response').then((resp) => {
        cy.wrap(resp.response.body.data.execution.granules[0]).as('granule');
        cy.get('@granule').then((granule) => {
          cy.get('.table .tbody .td').eq(0).contains(granule.granuleId);
          cy.get('.table .tbody .td').eq(1).should('have.text', 'Link').children('a')
            .should('have.attr', 'href')
            .should('include', `${granule.collectionId}/${granule.granuleId}`);
          cy.get('.table .tbody .td').eq(1).children('a').click();
        });
      });

      // Validate link navigates to the correct page
      cy.get('@granule').then((granule) => {
        cy.get('.heading--large').should('contain.text', granule.granuleId);
      });
    });

    it('should show an execution graph for a single execution', () => {
      const executionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';
      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${executionArn}` },
        { fixture: 'valid-execution.json', statusCode: 200 }
      );

      cy.visit(`/executions/execution/${executionArn}`);

      cy.contains('.heading--medium', 'Visual').should('exist');
      cy.get('svg').should('exist');
      cy.get('svg > .output > .nodes > .node').as('executionGraphNodes');
      cy.get('@executionGraphNodes').eq(0).should('have.text', 'start');
      cy.get('@executionGraphNodes').eq(1).should('have.text', 'HelloWorld');
      cy.get('@executionGraphNodes').eq(2).should('have.text', 'end');
    });

    it('should show the correct execution graph after previously viewing a different execution', () => {
      const firstExecutionArn = 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea';
      const secondExecutionArn = 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:7a71f849-57a0-40e7-8fca-5cf796602a07';

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${firstExecutionArn}` },
        { fixture: 'valid-execution.json', statusCode: 200 }
      );

      cy.intercept(
        { method: 'GET', url: `http://localhost:5001/executions/status/${secondExecutionArn}` },
        { fixture: 'valid-execution-2.json', statusCode: 200 }
      );

      cy.visit(`/executions/execution/${firstExecutionArn}`);

      cy.contains('.heading--medium', 'Visual').should('exist');
      cy.get('svg').should('exist');
      cy.get('svg > .output > .nodes > .node').as('executionGraphNodes');
      cy.get('@executionGraphNodes').eq(0).should('have.text', 'start');
      cy.get('@executionGraphNodes').eq(1).should('have.text', 'HelloWorld');

      cy.contains('.sidebar__nav--back', 'Back to Executions').click();
      cy.get(`.td a[href="/executions/execution/${secondExecutionArn}"]`).click();

      cy.contains('.heading--medium', 'Visual').should('exist');
      cy.get('svg').should('exist');
      cy.get('svg > .output > .nodes > .node').as('executionGraphNodes');
      cy.get('@executionGraphNodes').eq(0).should('have.text', 'start');
      cy.get('@executionGraphNodes').eq(1).should('not.have.text', 'HelloWorld');
      cy.get('@executionGraphNodes').eq(1).should('have.text', 'SyncGranule');
    });

    it('should show executions for a granule/collection', () => {
      const granuleId = 'MOD09GQ.A9344328.K9yI3O.006.4625818663028';
      cy.visit(`/executions/executions-list/MOD09GQ___006/${granuleId}`);

      cy.get('.heading--large').should('contain.text', granuleId);
      cy.get('.num-title').should('contain.text', '3');

      cy.get('.thead .tr .tr').children().as('columns');
      cy.get('@columns').should('have.length', 6);

      cy.get('@columns').eq(0).should('have.text', 'Name');
      cy.get('@columns').eq(1).should('have.text', 'Status');
      cy.get('@columns').eq(2).should('have.text', 'Workflow');
      cy.get('@columns').eq(3).should('have.text', 'Updated');
      cy.get('@columns').eq(4).should('have.text', 'Duration');
      cy.get('@columns').eq(5).should('have.text', 'Failed Events Snapshot');
    });

    it('Should dynamically update menu, sidbar and breadcrumb /executions links with latest filter criteria', () => {
      const status = 'complete';
      const type = 'HelloWorldWorkflow';
      const collectionId = 'MOD09GQ___006';
      const search = '1a5aaf01-835b-431a-924f-96a7feb3a3fb';

      cy.visit('/executions');

      cy.get('#status').as('status-input');
      cy.get('@status-input').click().type(status).type('{enter}');

      cy.get('#type').as('type-input');
      cy.get('@type-input').click().type(type).type('{enter}');

      cy.get('#collectionId').as('collectionId-input');
      cy.get('@collectionId-input').click().type(collectionId).type('{enter}');

      cy.get('#search').as('search-input');
      cy.get('@search-input').click().type(search).type('{enter}');

      cy.get('.table__main-asset > a').click();

      // Breakcrumb <Link> contain correct query params
      cy.get('.breadcrumb > :nth-child(2) > a')
        .should('have.attr', 'href')
        .and('include', `status=${status}`)
        .and('include', `type=${type}`)
        .and('include', `collectionId=${collectionId}`)
        .and('include', `search=${search}`);

      // // Menu <Link>s contain correct query params
      cy.get('nav > ul > :nth-child(5) > a')
        .should('have.attr', 'href')
        .and('include', 'status=complete')
        .and('include', 'type=HelloWorldWorkflow')
        .and('include', 'collectionId=MOD09GQ___006')
        .and('include', 'search=1a5aaf01-835b-431a-924f-96a7feb3a3fb');

      // // Sidebar <Link>s contain correct query params
      cy.get('.sidebar__nav--back')
        .should('have.attr', 'href')
        .and('include', 'status=complete')
        .and('include', 'type=HelloWorldWorkflow')
        .and('include', 'collectionId=MOD09GQ___006')
        .and('include', 'search=1a5aaf01-835b-431a-924f-96a7feb3a3fb');
    });
  });
});
