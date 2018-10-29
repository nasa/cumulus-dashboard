import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Rules page', () => {
  it('when not logged in it should redirect to login page', () => {
    cy.visit('#/rules');
    shouldBeRedirectedToLogin();
  });

  describe('when logged in', () => {
    const testRuleName = 'MOD09GQ_TEST_kinesisRule';
    const testProviderId = 'PODAAC_SWOT';
    const testCollectionId = 'MOD09GQ / 006';

    beforeEach(() => {
      cy.login();
      cy.task('resetState');
    });

    after(() => {
      cy.task('resetState');
    });

    it('should display a link to view rules', () => {
      cy.visit('/');
      cy.get('nav').contains('Rules').should('exist');
    });

    it('should display a list of rules', () => {
      cy.visit('/');
      cy.get('nav').contains('Rules').click();
      cy.url().should('include', '/#/rules');
      cy.get('table tbody tr').should('have.length', 1);
      cy.get(`table tr[data-value="${testRuleName}"]`)
        .should('exist')
        .within(() => {
          cy.contains(testProviderId).should('exist');
          cy.contains(testCollectionId).should('exist');
          cy.contains(testRuleName)
            .should('exist')
            .and('have.attr', 'href', `#/rules/rule/${testRuleName}`);
        });
    });

    it('display a rule with the correct data', () => {
      cy.visit('/#/rules');
      cy.get(`table tr[data-value="${testRuleName}"]`)
        .contains(testRuleName)
        .click();
      cy.url().should('include', `/#/rules/rule/${testRuleName}`);
      cy.get('.metadata__details')
        .should('exist')
        .within(() => {
          cy.get('dt')
            .contains('RuleName')
            .next('dd')
            .should('contain', testRuleName);
          cy.get('dt')
            .contains('Workflow')
            .next('dd')
            .should('contain', 'KinesisTriggerTest');
          cy.get('dt')
            .contains('Provider')
            .next('dd')
            .contains(testProviderId)
            .should('exist')
            .and('have.attr', 'href', `#/providers/provider/${testProviderId}`);
        });
    });

    it('creating a rule should add it to the list', () => {
      cy.visit('/#/rules');
      cy.get('a').contains('Add a rule').should('exist').as('addRule');
      cy.get('@addRule').should('have.attr', 'href', '#/rules/add');
      cy.get('@addRule').click();

      cy.get('textarea').clear({force: true});
      const newRule = '{{}"name":"newRule","workflow":"HelloWorldWorkflow","provider":"PODAAC_SWOT","collection":{{}"name":"MOD09GQ","version":"006"},"meta":{{}},"rule":{{}"type":"onetime","value":""},"state":"ENABLED"}';
      cy.get('textarea').type(newRule, {force: true});
      cy.get('form').get('input').contains('Submit').click();

      cy.get('.heading--xlarge').should('have.text', 'Rules');
      cy.contains('table tbody tr a', 'newRule')
        .should('exist')
        .and('have.attr', 'href', '#/rules/rule/newRule');
      cy.contains('table tbody tr a', 'PODAAC_SWOT')
        .should('exist')
        .and('have.attr', 'href', '#/providers/provider/PODAAC_SWOT');
    });

    it('deleting a rule should remove it from the list', () => {
      cy.visit('/#/rules');
      cy.get(`table tr[data-value="${testRuleName}"] input[type="checkbox"`)
        .should('exist')
        .click();
      cy.get('.form--controls button')
        .contains('Delete')
        .should('exist')
        .click();
      cy.get('.modal')
        .should('exist')
        .get('button')
        .contains('Confirm')
        .click();
      cy.get(`table tr[data-value="${testRuleName}"]`)
        .should('not.exist');
    });
  });
});
