import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Providers Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/providers');
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    // test provider name
    const name = 'TESTPROVIDER';
    beforeEach(() => {
      cy.login();
    });

    after(() => {
      cy.task('resetState');
    });

    it('displays a link to view providers', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Providers').should('exist').as('providers');
      cy.get('@providers').should('have.attr', 'href', '#/providers');
      cy.get('@providers').click();

      cy.url().should('include', 'providers');
      cy.get('.heading--xlarge').should('have.text', 'Providers');

      cy.get('table tbody tr').its('length').should('be.eq', 2);
    });

    it('providers page displays a button to add a new provider', () => {
      cy.visit('/#/providers');

      cy.get('.heading--large').should('have.text', 'Provider Overview');
      cy.contains('a', 'Add a Provider').should('exist').as('addProvider');
      cy.get('@addProvider').should('have.attr', 'href', '#/providers/add');
      cy.get('@addProvider').click();

      cy.get('.heading--xlarge').should('have.text', 'Providers');
      cy.get('.heading--large').should('have.text', 'Create a provider');

      // fill the form and submit
      cy.get('form div ul').as('providerinput');
      cy.get('@providerinput').contains('Provider Name').siblings('input').type(name);
      cy.get('@providerinput').contains('Concurrent Connnection Limit').siblings('input').clear().type(5);
      cy.get('@providerinput').contains('label', 'Protocol').siblings().children('select')
        .select('s3', {force: true}).should('have.value', 's3');

      cy.get('@providerinput').contains('Host').siblings('input').type('test-host');

      cy.get('form div input[value=Submit]').click();

      // displays the new provider
      cy.get('.heading--xlarge').should('have.text', 'Providers');
      cy.get('.heading--large').should('have.text', name);
      cy.url().should('include', `#/providers/provider/${name}`);

      // verify the new provider is added to the providers list
      cy.contains('a', 'Back to Provider').click();
      cy.contains('table tbody tr a', name)
        .should('exist')
        .and('have.attr', 'href', `#/providers/provider/${name}`);
    });

    it('provider page has button to edit the provider', () => {
      cy.visit(`/#/providers/provider/${name}`);
      cy.get('.heading--large').should('have.text', name);
      cy.contains('a', 'Edit').should('exist').as('editprovider');
      cy.get('@editprovider').should('have.attr', 'href').and('include', `#/providers/edit/${name}`);
      cy.get('@editprovider').click();

      cy.get('.heading--large').should('have.text', `Edit ${name}`);

      cy.get('form div ul').as('providerinput');
      cy.get('@providerinput').contains('Concurrent Connnection Limit').siblings('input').clear().type(12);
      cy.get('@providerinput').contains('Host').siblings('input').clear().type('test-host-new');

      cy.get('form div input[value=Submit]').click();

      // displays the updated provider
      cy.get('.heading--xlarge').should('have.text', 'Providers');
      cy.get('.heading--large').should('have.text', name);
      cy.get('.heading--medium').first().should('have.text', 'Provider Overview');
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Host').should('exist');
          cy.contains('a', 'Link').should('have.attr', 'href', 'test-host-new');
        });
    });

    it('provider page has button to delete the provider', () => {
      cy.visit(`/#/providers/provider/${name}`);
      cy.get('.heading--large').should('have.text', name);

      // delete provider
      cy.get('.dropdown__options__btn').click();
      cy.contains('span', 'Delete').click();
      cy.contains('button', 'Confirm').click();

      // verify the provider is now gone
      cy.url().should('include', 'providers');
      cy.get('.heading--xlarge').should('have.text', 'Providers');
      cy.contains('table tbody tr', name).should('not.exist');
    });
  });
});
