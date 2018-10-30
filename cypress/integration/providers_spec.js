import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Providers Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/providers');
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

    it('displays a link to view providers', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Providers').should('exist').as('providers');
      cy.get('@providers').should('have.attr', 'href', '#/providers');
      cy.get('@providers').click();

      cy.url().should('include', 'providers');
      cy.contains('.heading--xlarge', 'Providers').should('exist');

      cy.get('table tbody tr').its('length').should('be.eq', 2);
    });

    it('providers page displays a button to add a new provider', () => {
      const name = 'TESTPROVIDER';
      const connectionLimit = 5;
      const protocol = 's3';
      const host = 'test-host';

      cy.visit('/#/providers');

      cy.contains('.heading--large', 'Provider Overview').should('exist');
      cy.contains('a', 'Add a Provider').should('exist').as('addProvider');
      cy.get('@addProvider').should('have.attr', 'href', '#/providers/add');
      cy.get('@addProvider').click();

      cy.contains('.heading--xlarge', 'Providers').should('exist');
      cy.contains('.heading--large', 'Create a provider').should('exist');

      // fill the form and submit
      cy.get('form div ul').as('providerinput');
      cy.get('@providerinput')
        .contains('Provider Name')
        .siblings('input')
        .type(name);
      cy.get('@providerinput')
        .contains('Concurrent Connnection Limit')
        .siblings('input')
        .clear()
        .type(connectionLimit);
      cy.get('@providerinput')
        .contains('label', 'Protocol')
        .siblings()
        .children('select')
        .select(protocol, {force: true})
        .should('have.value', protocol);
      cy.get('@providerinput')
        .contains('Host')
        .siblings('input')
        .type(host);

      cy.get('form div input[value=Submit]').click();

      // displays the new provider
      cy.contains('.heading--xlarge', 'Providers').should('exist');
      cy.contains('.heading--large', name).should('exist');
      cy.contains('.heading--medium', 'Provider Overview').should('exist');
      cy.url().should('include', `#/providers/provider/${name}`);
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Global Connection Limit')
            .should('exist')
            .next()
            .should('have.text', `${connectionLimit}`);
          cy.contains('Protocol')
            .should('exist')
            .next()
            .should('have.text', protocol);
          cy.contains('Host')
            .should('exist')
            .next()
            .contains('a', 'Link')
            .should('have.attr', 'href', host);
        });

      // verify the new provider is added to the providers list
      cy.contains('a', 'Back to Provider').click();
      cy.contains('table tbody tr a', name)
        .should('exist')
        .and('have.attr', 'href', `#/providers/provider/${name}`);
    });

    it('provider page has button to edit the provider', () => {
      const name = 's3_provider';
      const connectionLimit = 12;
      const host = 'test-host-new';

      cy.visit(`/#/providers/provider/${name}`);
      cy.contains('.heading--large', name);
      cy.contains('a', 'Edit').should('exist').as('editprovider');
      cy.get('@editprovider')
        .should('have.attr', 'href')
        .and('include', `#/providers/edit/${name}`);
      cy.get('@editprovider').click();

      cy.contains('.heading--large', `Edit ${name}`).should('exist');

      cy.get('form div ul').as('providerinput');
      cy.get('@providerinput')
        .contains('Concurrent Connnection Limit')
        .siblings('input')
        .clear()
        .type(connectionLimit);
      cy.get('@providerinput')
        .contains('Host')
        .siblings('input')
        .clear()
        .type(host);

      cy.get('form div input[value=Submit]').click();

      // displays the updated provider
      cy.contains('.heading--xlarge', 'Providers').should('exist');
      cy.contains('.heading--large', name).should('exist');
      cy.contains('.heading--medium', 'Provider Overview').should('exist');
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Global Connection Limit')
            .should('exist')
            .next()
            .should('have.text', `${connectionLimit}`);
          cy.contains('Host')
            .should('exist')
            .next()
            .contains('a', 'Link')
            .should('have.attr', 'href', host);
        });
    });

    it('provider page has button to delete the provider', () => {
      const name = 's3_provider';
      cy.visit(`/#/providers/provider/${name}`);
      cy.contains('.heading--large', name).should('exist');

      // delete provider
      cy.get('.dropdown__options__btn').click();
      cy.contains('span', 'Delete').click();
      cy.contains('button', 'Confirm').click();

      // verify the provider is now gone
      cy.url().should('include', 'providers');
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('table tbody tr', name).should('not.exist');
    });
  });
});
