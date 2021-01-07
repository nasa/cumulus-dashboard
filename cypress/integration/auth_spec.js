import { shouldBeRedirectedToLogin, shouldHaveDeletedToken } from '../support/assertions';
import { listGranules } from '../../app/src/js/actions';
import { SET_TOKEN } from '../../app/src/js/actions/types';

describe('Dashboard authentication', () => {
  before(() => {
    // make sure to visit app before cy.login() so that reference to
    // data store exists on window.appStore
    cy.visit('/');
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should not attempt refresh for non-JWT token', () => {
    cy.window().its('appStore').then((store) => {
      store.dispatch({
        type: SET_TOKEN,
        token: 'this-is-a-fake-token'
      });

      store.dispatch(listGranules());

      // token should not have been updated
      expect(store.getState().api.tokens.inflight).to.eq(false);
      expect(store.getState().api.tokens.token).to.eq('this-is-a-fake-token');
    });

    cy.url().should('not.include', '/auth');
  });

  it('should logout user on invalid JWT token', () => {
    cy.window().its('appStore').then((store) => {
      cy.task('generateJWT', { expirationTime: 0 }).then((invalidJwt) => {
        // Dispatch an action to set the token
        store.dispatch({
          type: SET_TOKEN,
          token: invalidJwt
        });

        // Dispatch an action to request granules. It should fail
        // and log the user out when it recognizes the invalid token.
        store.dispatch(listGranules());
      });
    });

    shouldBeRedirectedToLogin();
    cy.contains('.error__report', 'Invalid token');

    shouldHaveDeletedToken();
  });

  it('should logout user on failed token refresh', () => {
    cy.intercept(
      { method: 'POST', url: `${Cypress.env('APIROOT')}/refresh` },
      { body: {}, statusCode: 500 }
    );

    cy.window().its('appStore').then((store) => {
      const expirationTime = (new Date(Date.now() - 24 * 3600 * 1000)).valueOf() / 1000.0;
      cy.task('generateJWT', { expirationTime }).then((expiredJwt) => {
        store.dispatch({
          type: SET_TOKEN,
          token: expiredJwt
        });

        store.dispatch(listGranules());
      });
    });

    shouldBeRedirectedToLogin();
    cy.contains('.error__report', 'Session expired');

    shouldHaveDeletedToken();
  });
});
