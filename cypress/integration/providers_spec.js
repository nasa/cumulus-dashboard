import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Providers Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/providers');
      shouldBeRedirectedToLogin();

      const name = 's3_provider';
      cy.visit(`/providers/provider/${name}`);
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

    it('should display a link to view providers', () => {
      cy.contains('nav li a', 'Providers').as('providers');
      cy.get('@providers').should('have.attr', 'href', '/providers');
      cy.get('@providers').click();

      cy.url().should('include', 'providers');
      cy.contains('.heading--xlarge', 'Providers');

      cy.get('table tbody tr').its('length').should('be.eq', 2);
    });

    it('should add a new provider', () => {
      const name = 'TESTPROVIDER';
      // TODO [MHS, 2020-01-14]  Set Back to 5 when CUMULUS-1738 is fixed to show the globalCollection limit.
      // const connectionLimit = 5;
      const connectionLimit = 10;
      const protocol = 's3';
      const host = 'test-host';

      cy.visit('/providers');

      cy.contains('.heading--large', 'Provider Overview');
      cy.contains('a', 'Add a Provider').as('addProvider');
      cy.get('@addProvider').should('have.attr', 'href', '/providers/add');
      cy.get('@addProvider').click();

      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('.heading--large', 'Create a provider');

      // fill the form and submit
      cy.get('form div ul').as('providerinput');
      cy.get('@providerinput')
        .contains('Provider Name')
        .siblings('input')
        .type(name);
      // TODO [MHS, 2020-01-14] Fix this so that it shows up as part of CUMULUS-1738
      // cy.get('@providerinput')
      //   .contains('Concurrent Connnection Limit')
      //   .siblings('input')
      //   .clear()
      //   .type(connectionLimit);
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

      cy.get('form div button').contains('Submit').click();

      // displays the new provider
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('.heading--large', name);
      cy.contains('.heading--medium', 'Provider Overview');
      cy.url().should('include', `providers/provider/${name}`);
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Global Connection Limit')
            .next()
            .should('have.text', `${connectionLimit}`);
          cy.contains('Protocol')
            .next()
            .should('have.text', protocol);
          cy.contains('Host')
            .next()
            .contains('a', 'Link')
            .should('have.attr', 'href', host);
        });

      // verify the new provider is added to the providers list
      cy.contains('a', 'Back to Provider').click();
      cy.contains('table tbody tr a', name)
        .should('have.attr', 'href', `/providers/provider/${name}`);
    });

    it('should edit a provider', () => {
      const name = 's3_provider';
      const connectionLimit = 10;
      // TODO [MHS, 2020-01-14]  set back to 12 when CUMULUS-1738 is fixed.
      // const connectionLimit = 12;
      const host = 'test-host-new';

      cy.visit(`/providers/provider/${name}`);
      cy.contains('.heading--large', name);
      cy.contains('a', 'Edit').as('editprovider');
      cy.get('@editprovider')
        .should('have.attr', 'href')
        .and('include', `/providers/edit/${name}`);
      cy.get('@editprovider').click();

      cy.contains('.heading--large', `Edit ${name}`);

      cy.get('form div ul').as('providerinput');
      // TODO [MHS, 2020-01-14]  Fix this when CUMULUS-1738 is fixed.
      // cy.get('@providerinput')
      //   .contains('Concurrent Connnection Limit')
      //   .siblings('input')
      //   .clear()
      //   .type(connectionLimit);
      cy.get('@providerinput')
        .contains('Host')
        .siblings('input')
        .clear()
        .type(host);

      cy.get('form div button').contains('Submit').click();

      // displays the updated provider
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('.heading--large', name);
      cy.contains('.heading--medium', 'Provider Overview');
      cy.get('.metadata__details')
        .within(() => {
          cy.contains('Global Connection Limit')
            .next()
            .should('have.text', `${connectionLimit}`);
          cy.contains('Host')
            .next()
            .contains('a', 'Link')
            .should('have.attr', 'href', host);
        });
    });

    it('should delete a provider', () => {
      const name = 's3_provider';
      cy.visit(`/providers/provider/${name}`);
      cy.contains('.heading--large', name);

      // delete provider
      cy.get('.dropdown__options__btn').click();
      cy.contains('span', 'Delete').click();
      cy.contains('button', 'Confirm').click();

      // verify the provider is now gone
      cy.url().should('include', 'providers');
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('table tbody tr', name).should('not.exist');
    });

    it('should fail to delete a provider with an associated rule', () => {
      const name = 'PODAAC_SWOT';
      cy.visit(`/providers/provider/${name}`);
      cy.contains('.heading--large', name);

      // delete provider
      cy.get('.dropdown__options__btn').click();
      cy.contains('span', 'Delete').click();
      cy.contains('button', 'Confirm').click();

      // error should be displayed indicating that deletion failed
      cy.contains('Provider Overview')
        .parents('section')
        .get('.error__report');

      // provider should still exist in list
      cy.contains('a', 'Back to Providers').click();
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('table tbody tr a', name);
    });
  });
});
