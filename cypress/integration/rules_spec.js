import { shouldBeRedirectedToLogin } from '../support/assertions';
import { getCollectionId } from '../../app/src/js/utils/format';

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

    it('Should update URL when search filter is changed.', () => {
      cy.visit('/rules');
      cy.get('.search').as('search');
      cy.get('@search').click().type('L2');
      cy.url().should('include', 'search=L2');
    });

    it('display a rule with the correct data', () => {
      cy.visit('/rules');
      cy.contains('.table .tr a', testRuleName)
        .click();
      cy.url().should('include', `/rules/rule/${testRuleName}`);
      cy.get('.metadata__details')
        .within(() => {
          cy.get('dt')
            .contains('Rule Name')
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

    it('clicking disable should disable a rule', () => {
      cy.visit('/rules');
      cy.contains('.table .tr a', testRuleName)
        .click();
      cy.url().should('include', `/rules/rule/${testRuleName}`);
      cy.contains('.heading--large', testRuleName);
      cy.contains('.status--process', 'Enabled');
      cy.contains('.dropdown__options__btn', 'Options').click();
      cy.contains('.async__element', 'Disable').click();

      cy.get('p').contains('You have submitted a request to disable the following rule:' && `${testRuleName}` && 'Are you sure you want to disable this rule?');
      cy.contains('.modal-footer button', 'Cancel').click();

      cy.contains('.dropdown__options__btn', 'Options').click();
      cy.contains('.async__element', 'Disable').click();
      cy.get('p').contains('You have submitted a request to disable the following rule:' && `${testRuleName}` && 'Are you sure you want to disable this rule?');
      cy.contains('.modal-footer button', 'Confirm').click();

      cy.contains('.modal-body', `Rule ${testRuleName} was disabled`);
      cy.contains('.modal-footer button', 'Close').click();

      cy.contains('.status--process', 'Disabled');
    });

    it('creating a rule should add it to the list', () => {
      cy.visit('/rules');
      cy.get('a').contains('Add Rule').as('addRule');
      cy.get('@addRule').should('have.attr', 'href', '/rules/add');
      cy.get('@addRule').click();

      const ruleName = 'newRule';
      const workflow = 'HelloWorldWorkflow';
      const provider = 'PODAAC_SWOT';
      const collection = getCollectionId({ name: 'MOD09GQ', version: '006' });

      // Fill the form and submit
      // mhs: I think we're seeing https://www.cypress.io/blog/2018/02/05/when-can-the-test-start/
      // Typing into a form that's not ready. (https://github.com/cypress-io/cypress/issues/3817)
      cy.get('form div ul').as('ruleInput');
      cy.get('@ruleInput')
        .contains('name', { matchCase: false })
        .siblings('input')
        .wait(500)
        .type(ruleName);
      cy.get('@ruleInput')
        .contains('.dropdown__label', 'workflow', { matchCase: false })
        .siblings()
        .find('.react-select__value-container')
        .click();
      cy.contains('div[id*="react-select"]', workflow).click();
      cy.get('@ruleInput')
        .contains('.dropdown__label', 'provider', { matchCase: false })
        .siblings()
        .find('.react-select__value-container')
        .click();
      cy.contains('div[id*="react-select"]', provider).click();
      cy.get('@ruleInput')
        .contains('.dropdown__label', 'collection', { matchCase: false })
        .siblings()
        .find('.react-select__value-container')
        .click();
      cy.contains('div[id*="react-select"]', collection).click();

      cy.get('@ruleInput')
        .contains('.form__textarea', 'Metadata');
      // test invalid json error
      cy.window().its('aceEditorRef').its('editor').then((editor) => {
        editor.setValue('{badjson}');
      });
      cy.contains('.error__report', 'Must be valid JSON');

      cy.get('@ruleInput')
        .contains('.dropdown__label', 'type', { matchCase: false })
        .siblings()
        .find('.react-select__value-container')
        .click();
      cy.contains('div[id*="react-select"]', 'onetime').click();
      cy.get('@ruleInput')
        .contains('.dropdown__label', 'state', { matchCase: false })
        .siblings()
        .find('.react-select__value-container')
        .click();
      cy.contains('div[id*="react-select"]', 'ENABLED').click();

      cy.contains('form button', 'Submit').click();
      const errorMessage = 'Please review the following fields and submit again: \'Metadata\'';
      cy.contains('.error__report', errorMessage);

      // fix the json input
      cy.editJsonTextarea({ data: { metakey: 'metavalue' } });
      cy.contains('form button', 'Submit').click();

      cy.get('.error__report').should('not.exist');
      cy.url().should('include', 'rule/newRule');
      cy.contains('.heading--xlarge', 'Rules');
      cy.contains('.heading--large', ruleName);
      cy.contains('.heading--medium', 'Rule Overview');
      cy.url().should('include', `rules/rule/${ruleName}`);
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Rule Name').next().should('have.text', ruleName);
          cy.contains('Workflow').next().should('have.text', workflow);
          cy.contains('Provider')
            .next()
            .contains('a', provider)
            .should('have.attr', 'href', `/providers/provider/${provider}`);
        });

      cy.contains('a', 'Back to Rules').click();
      cy.contains('.table .tbody .tr a', ruleName)
        .should('have.attr', 'href', `/rules/rule/${ruleName}`);
      cy.task('resetState');
    });

    it('copying a rule should add it to the list', () => {
      const newName = 'testRule2';

      cy.visit('/rules');
      cy.contains('.table .tbody .tr a', testRuleName)
        .and('have.attr', 'href', `/rules/rule/${testRuleName}`)
        .click();

      cy.contains('.heading--large', testRuleName);
      cy.contains('.button--small', 'Copy').click();
      cy.contains('.heading--large', 'Copy a rule');

      cy.get('form div ul')
        .contains('name', { matchCase: false })
        .siblings('input')
        .clear()
        .type(newName);

      cy.contains('form button', 'Submit').click();

      cy.contains('.heading--xlarge', 'Rules');
      cy.contains('.heading--large', newName);
      cy.contains('.heading--medium', 'Rule Overview');
      cy.url().should('include', `rules/rule/${newName}`);
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Rule Name').next().should('have.text', newName);
          cy.contains('Provider')
            .next()
            .contains('a', testProviderId)
            .should('have.attr', 'href', `/providers/provider/${testProviderId}`);
        });

      cy.contains('a', 'Back to Rules').click();
      cy.contains('.table .tbody .tr a', newName)
        .should('have.attr', 'href', `/rules/rule/${newName}`);
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
      const provider = 's3_provider';
      cy.contains('.ace_variable', 'name');
      cy.editJsonTextarea({ data: { provider }, update: true });
      cy.contains('form button', 'Submit').click();
      cy.contains('.default-modal .edit-rule__title', 'Edit Rule');
      cy.contains('.default-modal .modal-body', `Rule ${testRuleName} has been updated`);
      cy.contains('.modal-footer button', 'Close').click();

      // displays the updated rule
      cy.contains('.heading--large', testRuleName);
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Provider').next().should('have.text', provider);
        });

      // verify the collection is updated by looking at the Edit page
      cy.contains('a', 'Edit').click();

      cy.contains('.ace_variable', 'name');
      cy.getJsonTextareaValue().then((ruleJson) => {
        expect(ruleJson.provider).to.equal(provider);
      });
      cy.contains('.heading--large', testRuleName);

      // Test error flow
      const errorRuleType = 'test';
      const errorMessage = 'The record has validation errors: [{"keyword":"enum","dataPath":".rule.type","schemaPath":"#/properties/rule/properties/type/enum","params":{"allowedValues":["onetime","scheduled","sns","kinesis","sqs"]},"message":"should be equal to one of the allowed values"}]';
      cy.contains('.ace_variable', 'name');
      cy.editJsonTextarea({ data: { rule: { type: errorRuleType } }, update: true });

      // Edit Rule should allow for continued editing
      cy.contains('form button', 'Submit').click();
      cy.contains('.default-modal .edit-rule__title', 'Edit Rule');
      cy.contains('.default-modal .modal-body', `Rule ${testRuleName} has encountered an error.`);
      cy.contains('.default-modal .modal-body .error', errorMessage);
      cy.contains('.modal-footer button', 'Continue Editing Rule').click();
      cy.url().should('include', `rules/edit/${testRuleName}`);

      // There should be an error report
      cy.contains('.error__report', errorMessage);

      // Cancel Request should return to rule page
      cy.contains('form button', 'Submit').click();
      cy.contains('.modal-footer button', 'Cancel Request').click();
      // cy.wait('@getCollection');
      cy.contains('.heading--xlarge', 'Rules');
      cy.contains('.heading--large', `${testRuleName}`);
      cy.task('resetState');
    });

    it('deleting a rule should remove it from the list', () => {
      cy.intercept('DELETE', '/rules/MOD09GK_TEST_kinesisRule').as('deleteRule');
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
      cy.wait('@deleteRule');
      cy.get('.modal .button--cancel').click();
      cy.contains('.table .tr a', testRuleName)
        .should('not.exist');
      cy.task('resetState');
    });

    it('Should trigger workflow when a rule is rerun', () => {
      cy.intercept('PUT', '/rules/MOD09GK_TEST_kinesisRule', { fixtures: 'rule-success.json' }).as('putRule');
      cy.visit('/rules/rule/MOD09GK_TEST_kinesisRule');
      cy.get('.dropdown__options__btn').click();
      cy.get('.dropdown__menu').contains('Rerun').click();
      cy.get('.button--submit').click();
      cy.wait('@putRule');
      cy.get('.button--cancel').click();
      cy.get('.modal-content').should('not.be', 'visible');
    });

    it('Should display error when a rule fails to rerun.', () => {
      cy.intercept(
        { method: 'PUT', url: '/rules/MOD09GK_TEST_kinesisRule' },
        { fixture: 'rule-error.json', statusCode: 503 }
      ).as('putRule');
      cy.visit('/rules/rule/MOD09GK_TEST_kinesisRule');
      cy.get('.dropdown__options__btn').click();
      cy.get('.dropdown__menu').contains('Rerun').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content').should('not.be', 'visible');
      cy.contains('.error__report', 'Error');
    });

    it('Should dynamically update menu, sidbar and breadcrumb /rules links with latest filter criteria', () => {
      const search = 'MOD09GK_TEST_kinesisRule';

      cy.visit('/rules');

      cy.get('#search').as('search-input');
      cy.get('@search-input').click().type(search).type('{enter}');

      cy.get('.table__main-asset > a').click();

      // Breakcrumb <Link> contain correct query params
      cy.get('.breadcrumb > :nth-child(2) > a')
        .should('have.attr', 'href')
        .and('include', `search=${search}`);

      // Menu <Link>s contain correct query params
      cy.get('nav > ul > :nth-child(7) > a')
        .should('have.attr', 'href')
        .and('include', `search=${search}`);

      // Sidebar <Link>s contain correct query params
      cy.get('.sidebar__nav--back')
        .should('have.attr', 'href')
        .and('include', `search=${search}`);
    });
  });
});
