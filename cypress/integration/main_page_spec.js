import {
  shouldBeLoggedIn,
  shouldBeRedirectedToLogin,
  shouldHaveNoToken,
  shouldHaveDeletedToken
} from '../support/assertions';

import { API_VERSION } from '../../app/scripts/actions/types';

describe('Dashboard Home Page', () => {
  it('When not logged in it should redirect to login page', () => {
    cy.visit('/');
    shouldBeRedirectedToLogin();
    shouldHaveNoToken();
  });

  it('Logging in successfully redirects to the Dashboard main page', () => {
    cy.visit('/');
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').click();
    });

    shouldBeLoggedIn();
    cy.get('nav')
      .contains('Collections')
      .should('have.attr', 'href')
      .and('include', '/collections');
    cy.get('nav')
      .contains('Rules')
      .should('have.attr', 'href')
      .and('include', '/rules');
  });

  it('Logs in successfully after failed login', () => {
    // simulate failed login
    cy.visit('/#/auth')
      .window().then(function (window) {
        window.location.hash = '#/auth?token=failed-token';
      });

    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').click();
    });

    shouldBeLoggedIn();
  });

  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
    });

    beforeEach(() => {
      cy.login();
      cy.visit('/');
    });

    afterEach(() => {
      // Cypress can sometimes have weird timeout issues if you try to
      // cy.visit() the URL you are already on. To avoid this problem,
      // we log out after each test and reload to the /auth page, so that
      // cy.visit('/') should always work.
      //
      // https://github.com/cypress-io/cypress/issues/1311#issuecomment-393896371
      cy.logout();
    });

    after(() => {
      cy.task('resetState');
    });

    it('displays a compatible Cumulus API Version number', () => {
      const apiVersionNumber = 'a.b.c';
      cy.window().its('appStore').then((store) => {
        store.dispatch({
          type: API_VERSION,
          payload: { versionNumber: apiVersionNumber }
        });

        cy.get('h5[class=api__version]').should((apiVersionWrapper) => {
          expect(apiVersionWrapper.first()).to.contain(apiVersionNumber);
        });
      });
    });

    it('Logging out successfully redirects to the login screen', () => {
      console.log('Running main page spec');

      cy.get('nav li').last().within(() => {
        cy.get('a').should('have.text', 'Log out');
      });
      cy.get('nav li').last().click();
      cy.url().should('include', '/#/auth');

      cy.visit('#/collections');

      cy.url().should('not.include', '/#/collections');
      cy.url().should('include', '/#/auth');

      shouldHaveDeletedToken();
    });
  });
});
