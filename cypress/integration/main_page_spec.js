import {
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

  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
    });

    beforeEach(() => {
      cy.login();
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

        cy.get('h5[class=apiVersion]').should((apiVersionWrapper) => {
          expect(apiVersionWrapper.first()).to.contain(apiVersionNumber);
        });
      });
    });
  });

  it('Logging in successfully redirects to the Dashboard main page', () => {
    cy.visit('/');
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').click();
    });

    cy.get('h1[class=heading--xlarge').should('have.text', 'CUMULUS Dashboard');
    cy.get('nav')
      .contains('Collections')
      .should('have.attr', 'href')
      .and('include', '/collections');
    cy.get('nav')
      .contains('Rules')
      .should('have.attr', 'href')
      .and('include', '/rules');
  });

  it('Logging out successfully redirects to the login screen', () => {
    cy.visit('/');
    cy.get('div[class=modal__internal]').within(() => {
      cy.get('a').click();
    });

    cy.get('h1[class=heading--xlarge').should('have.text', 'CUMULUS Dashboard');

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
