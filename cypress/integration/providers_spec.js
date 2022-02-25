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
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.task('resetState');
      cy.visit('/');
      cy.intercept('POST', '/providers').as('postProvider');
      cy.intercept('GET', '/providers?limit=*').as('getProviders');
      cy.intercept('GET', '/providers/*').as('getProvider');
    });

    it('should display a link to view providers', () => {
      cy.contains('nav li a', 'Providers').as('providers');
      cy.get('@providers').should('have.attr', 'href', '/providers');
      cy.get('@providers').click();

      cy.url().should('include', 'providers');
      cy.contains('.heading--xlarge', 'Providers');

      cy.get('.table .tbody .tr').should('have.length', 2);
    });

    describe('add a new provider', () => {
      const expectedFieldsAll = [
        'Provider Name',
        'Concurrent Connection Limit',
        'Protocol',
        'Host',
      ];
      const expectedFieldsAuth = ['Port', 'Username', 'Password'];
      const expectedFieldsHttp = ['Allowed Redirects', 'S3 URI For Custom SSL Certificate'];
      const expectedFieldsSftp = ['Private Key', 'AWS KMS Customer Master Key ARN Or Alias'];

      it('should go to add providers page', () => {
        cy.visit('/providers');
        cy.contains('.heading--large', 'Provider Overview');
        cy.contains('a', 'Add Provider').as('addProvider');
        cy.get('@addProvider').should('have.attr', 'href', '/providers/add');
        cy.get('@addProvider').click();
        cy.contains('.heading--xlarge', 'Providers');
        cy.contains('.heading--large', 'Create a provider');
      });

      it('should display correct fields for an http provider', () => {
        const protocol = 'http';
        const expectedFields = [
          ...expectedFieldsAll,
          ...expectedFieldsAuth,
          ...expectedFieldsHttp,
        ];
        const unexpectedFields = [...expectedFieldsSftp];

        cy.visit('/providers/add');
        cy.get('form div ul').as('providerInput');
        cy.get('@providerInput')
          .contains('.dropdown__label', 'Protocol')
          .siblings()
          .find('.react-select__value-container')
          .click();
        cy.contains('div[id*="react-select"]', protocol).click();
        expectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('exist');
        });
        unexpectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('not.exist');
        });
      });

      it('should display correct fields for an https provider', () => {
        const protocol = 'https';
        const expectedFields = [
          ...expectedFieldsAll,
          ...expectedFieldsAuth,
          ...expectedFieldsHttp,
        ];
        const unexpectedFields = [...expectedFieldsSftp];

        cy.visit('/providers/add');
        cy.get('form div ul').as('providerInput');
        cy.get('@providerInput')
          .contains('.dropdown__label', 'Protocol')
          .siblings()
          .find('.react-select__value-container')
          .click();
        cy.contains('div[id*="react-select"]', protocol).click();
        expectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('exist');
        });
        unexpectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('not.exist');
        });
      });

      it('should display correct fields for an s3 provider', () => {
        const protocol = 's3';
        const expectedFields = [...expectedFieldsAll];
        const unexpectedFields = [
          ...expectedFieldsAuth,
          ...expectedFieldsHttp,
          ...expectedFieldsSftp,
        ];

        cy.visit('/providers/add');
        cy.get('form div ul').as('providerInput');
        cy.get('@providerInput')
          .contains('.dropdown__label', 'Protocol')
          .siblings()
          .find('.react-select__value-container')
          .click();
        cy.contains('div[id*="react-select"]', protocol).click();
        expectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('exist');
        });
        unexpectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('not.exist');
        });
      });

      it('should display correct fields for an ftp provider', () => {
        const protocol = 'ftp';
        const expectedFields = [...expectedFieldsAll, ...expectedFieldsAuth];
        const unexpectedFields = [...expectedFieldsHttp, ...expectedFieldsSftp];

        cy.visit('/providers/add');
        cy.get('form div ul').as('providerInput');
        cy.get('@providerInput')
          .contains('.dropdown__label', 'Protocol')
          .siblings()
          .find('.react-select__value-container')
          .click();
        cy.contains('div[id*="react-select"]', protocol).click();
        expectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('exist');
        });
        unexpectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('not.exist');
        });
      });
      it('should display correct fields for an sftp provider', () => {
        const protocol = 'sftp';
        const expectedFields = [
          ...expectedFieldsAll,
          ...expectedFieldsAuth,
          ...expectedFieldsSftp,
        ];
        const unexpectedFields = [...expectedFieldsHttp];

        cy.visit('/providers/add');
        cy.get('form div ul').as('providerInput');
        cy.get('@providerInput')
          .contains('.dropdown__label', 'Protocol')
          .siblings()
          .find('.react-select__value-container')
          .click();
        cy.contains('div[id*="react-select"]', protocol).click();
        expectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('exist');
        });
        unexpectedFields.forEach((field) => {
          cy.get('@providerInput').contains(field).should('not.exist');
        });
      });
      it('should add a new provider', () => {
        const name = 'TEST_PROVIDER';
        const connectionLimit = 5;
        const protocol = 's3';
        const host = 'test-host';

        cy.visit('/providers/add');
        // fill the form and submit
        cy.get('form div ul').as('providerInput');
        cy.get('@providerInput')
          .contains('.dropdown__label', 'Protocol')
          .siblings()
          .find('.react-select__value-container')
          .click();
        cy.contains('div[id*="react-select"]', protocol).click();
        cy.get('@providerInput')
          .contains('Provider Name')
          .siblings('input')
          .type(name);
        cy.get('@providerInput')
          .contains('Concurrent Connection Limit')
          .siblings('input')
          .clear()
          .type(connectionLimit);
        cy.get('@providerInput').contains('Host').siblings('input').type(host);

        cy.get('form div button').contains('Submit').click();
        cy.wait('@postProvider');
        cy.wait('@getProvider');
        cy.url().should('include', `providers/provider/${name}`);
        cy.contains('.heading--xlarge', 'Providers');
        cy.contains('.heading--large', name);
        cy.contains('.heading--medium', 'Provider Overview');
        cy.get('.metadata__details').within(() => {
          cy.contains('Global Connection Limit')
            .next()
            .should('have.text', connectionLimit);
          cy.contains('Protocol').next().should('have.text', protocol);
          cy.contains('Host').next().should('have.text', host);
        });

        // Verify the new provider is added to the providers list, after allowing
        // ES indexing to finish (hopefully), so that the new provider is part
        // of the query results.
        cy.wait(1000);
        cy.contains('a', 'Back to Providers').click();
        cy.wait('@getProviders');
        cy.contains('.table .tbody .tr a', name).should(
          'have.attr',
          'href',
          `/providers/provider/${name}`
        );
      });
    });

    it('should edit a provider', () => {
      const name = 's3_provider';
      const connectionLimit = 12;
      const host = 'test-host-new';
      const port = 3000;

      cy.visit(`/providers/provider/${name}`);
      cy.contains('.heading--large', name);
      cy.contains('a', 'Edit').as('editProvider');
      cy.get('@editProvider')
        .should('have.attr', 'href')
        .and('include', `/providers/edit/${name}`);
      cy.get('@editProvider').click();

      cy.contains('.heading--large', `Edit provider: ${name}`);

      cy.get('form div ul').as('providerInput');
      cy.get('@providerInput')
        .contains('Concurrent Connection Limit')
        .siblings('input')
        .clear()
        .type(connectionLimit);
      cy.get('@providerInput')
        .contains('Host')
        .siblings('input')
        .clear()
        .type(host);
      cy.get('@providerInput')
        .contains('Port')
        .siblings('input')
        .clear()
        .type(port);

      cy.get('form div button').contains('Submit').click();

      // displays the updated provider
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('.heading--large', name);
      cy.contains('.heading--medium', 'Provider Overview');
      cy.get('.metadata__details').within(() => {
        cy.contains('Global Connection Limit')
          .next()
          .should('have.text', connectionLimit);
        cy.contains('Host').next().should('have.text', host);
        cy.contains('Port').next().should('have.text', port);
      });
    });

    it('should delete a provider', () => {
      const name = 's3_provider';
      cy.visit(`/providers/provider/${name}`);
      cy.contains('.heading--large', name);

      // delete provider
      cy.get('.button--delete').click();
      cy.contains('button', 'Confirm').click();

      // verify the provider is now gone
      cy.url().should('include', 'providers');
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('.table .tbody .tr', name).should('not.exist');
    });

    it('should fail to delete a provider with an associated rule', () => {
      const name = 'PODAAC_SWOT';
      cy.visit(`/providers/provider/${name}`);
      cy.contains('.heading--large', name);

      // delete provider
      cy.get('.button--delete').click();
      cy.contains('button', 'Confirm').click();

      // error should be displayed indicating that deletion failed
      cy.contains('Provider Overview').parents('section').get('.error__report');

      // provider should still exist in list
      cy.contains('a', 'Back to Providers').click();
      cy.contains('.heading--xlarge', 'Providers');
      cy.contains('.table .tbody .tr a', name);
    });
  });
});
