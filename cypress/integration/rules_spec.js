import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Rules page', () => {
  it('when not logged in it should redirect to login page', () => {
    cy.visit('/rules');
    shouldBeRedirectedToLogin();
  });

  describe('when logged in', () => {
    const testRuleName = 'MOD09GK_TEST_kinesisRule';
    const testProviderId = 'PODAAC_SWOT';
    const testCollectionId = 'MOD09GK / 006';

    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
    });

    it('should display a link to view rules', () => {
      cy.visit('/');
      cy.get('nav').contains('Rules');
    });

    it('should display a list of rules', () => {
      cy.visit('/');
      cy.get('nav').contains('Rules').click();
      cy.url().should('include', '/rules');
      cy.get('.table .tbody .tr').should('have.length', 1);
      cy.contains('.table .tr', testRuleName)
        .within(() => {
          cy.contains(testProviderId);
          cy.contains(testCollectionId);
          cy.contains(testRuleName)
            .should('have.attr', 'href', `/rules/rule/${testRuleName}`);
        });
    });

    it('display a rule with the correct data', () => {
      cy.visit('/rules');
      cy.contains('.table .tr a', testRuleName)
        .click();
      cy.url().should('include', `/rules/rule/${testRuleName}`);
      cy.get('.metadata__details')
        .within(() => {
          cy.get('dt')
            .contains('RuleName')
            .next('dd')
            .should('contain', testRuleName);
          cy.get('dt')
            .contains('Workflow')
            .next('dd')
            .should('contain', 'HelloWorldWorkflow');
          cy.get('dt')
            .contains('Provider')
            .next('dd')
            .contains(testProviderId)
            .should('have.attr', 'href', `/providers/provider/${testProviderId}`);
        });
    });

    it('creating a rule should add it to the list', () => {
      cy.visit('/rules');
      cy.get('a').contains('Add a rule').as('addRule');
      cy.get('@addRule').should('have.attr', 'href', '/rules/add');
      cy.get('@addRule').click();

      const ruleName = 'newRule';
      const workflow = 'HelloWorldWorkflow';
      const provider = 'PODAAC_SWOT';
      const collection = { name: 'MOD09GQ', version: '006' };
      const newRule = {
        name: ruleName,
        workflow,
        provider,
        collection,
        meta: {},
        rule: {
          type: 'onetime',
          'value': ''
        },
        state: 'ENABLED'
      };
      cy.editJsonTextarea({ data: newRule });
      cy.contains('form button', 'Submit').click();

      cy.contains('.default-modal .add-rule__title', 'Add Rule');
      cy.contains('.default-modal .modal-body', `Add rule ${ruleName}`);
      cy.contains('.modal-footer button', 'Confirm Rule').click();

      cy.contains('.heading--xlarge', 'Rules');
      cy.contains('.table .tbody .tr a', ruleName)
        .and('have.attr', 'href', `/rules/rule/${ruleName}`).click();

      cy.contains('.heading--xlarge', 'Rules');
      cy.contains('.heading--large', ruleName);
      cy.contains('.heading--medium', 'Rule Overview');
      cy.url().should('include', `rules/rule/${ruleName}`);
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('RuleName').next().should('have.text', ruleName);
          cy.contains('Workflow').next().should('have.text', workflow);
          cy.contains('Provider')
            .next()
            .contains('a', provider)
            .should('have.attr', 'href', `/providers/provider/${provider}`);
        });
      cy.task('resetState');
    });

    it('editing a rule and returning to the rules page should show the new changes', () => {
      cy.visit('/rules');
      cy.contains('.table .tbody .tr a', testRuleName)
        .and('have.attr', 'href', `/rules/rule/${testRuleName}`)
        .click();

      cy.contains('.heading--large', testRuleName);
      cy.contains('.button--small', 'Edit').click();
      cy.contains('.heading--large', `${testRuleName}`);

      // update rule and submit
      const provider = 'newProvider';
      cy.contains('.ace_variable', 'name');
      cy.editJsonTextarea({ data: { provider }, update: true });
      cy.contains('form button', 'Submit').click();
      cy.contains('.heading--large', testRuleName);
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Provider').next().should('have.text', provider);
        });

      cy.contains('a', 'Back to Rules').click();
      cy.contains('.heading--large', 'Rule Overview');
      cy.contains('.table .tr', testRuleName)
        .within(() => {
          cy.contains(provider)
            .should('have.attr', 'href', `/providers/provider/${provider}`);
        });
    });

    it('deleting a rule should remove it from the list', () => {
      cy.visit('/rules');
      cy.contains('.table .tr', testRuleName)
        .within(() => {
          cy.get('input[type="checkbox"]').click();
        });
      cy.get('.form--controls button')
        .contains('Delete')
        .click();
      cy.get('.modal')
        .get('button')
        .contains('Confirm')
        .click();
      cy.contains('.table .tr a', testRuleName)
        .should('not.exist');
      cy.task('resetState');
    });
  });
});
