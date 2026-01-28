import { listGranules } from '../../app/src/js/actions';
import { SET_TOKEN } from '../../app/src/js/actions/types';

describe('Dashboard authentication', () => {
  before(() => {
    // make sure to visit app before cy.login() so that reference to
    // data store exists on window.appStore
    cy.visit('/');
  });

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/');
      cy.wait(1000);
    });

    it('should not attempt refresh for non-JWT token', () => {
      cy.window().its('top').its('appStore').then((store) => {
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
  });

  describe('When not logged in (auth failure scenarios)', () => {
    beforeEach(() => {
      // For auth failure tests, start fresh without login
      cy.visit('/');
      cy.wait(1000);
    });

    it('should logout user on invalid JWT token', () => {
      cy.task('generateJWT', { expirationTime: 0 }).then((invalidJwt) => {
        // Set invalid token in localStorage first (synchronously)
        cy.window().then((win) => {
          win.localStorage.setItem('auth-token', invalidJwt);
        }).then(() => {
          // Then dispatch Redux actions
          cy.window().its('top').its('appStore').then((store) => {
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
        
        // Wait for async middleware, deleteToken, and redirect to complete
        cy.url({ timeout: 10000 }).should('include', '/auth');

        // Verify error message is displayed to user
        cy.contains('.error__report', 'Invalid token');

        // Wait for DELETE_TOKEN to complete and localStorage to be cleared
        cy.window().its('localStorage').invoke('getItem', 'auth-token').should('eq', '');

        // Verify token is deleted from Redux store
        cy.window().its('top').its('appStore').then((store) => {
          expect(store.getState().api.tokens.token).to.equal(null);
        });
      });
    });

    it('should logout user on failed token refresh', () => {
      cy.intercept(
        { method: 'POST', url: `${Cypress.env('APIROOT')}/refresh` },
        { body: {}, statusCode: 500 }
      ).as('failedRefresh');

      const expirationTime = (new Date(Date.now() - 24 * 3600 * 1000)).valueOf() / 1000.0;
      cy.task('generateJWT', { expirationTime }).then((expiredJwt) => {
        // Set expired token in localStorage first (synchronously)
        cy.window().then((win) => {
          win.localStorage.setItem('auth-token', expiredJwt);
        }).then(() => {
          // Then dispatch Redux actions
          cy.window().its('top').its('appStore').then((store) => {
            // Dispatch an action to set the token
            store.dispatch({
              type: SET_TOKEN,
              token: expiredJwt
            });

            // Dispatch an action to request granules, which should trigger refresh, fail, and logout
            store.dispatch(listGranules());
          });
        });
        
        // Wait for the refresh request to be made and fail
        cy.wait('@failedRefresh');

        // Wait for redirect to /auth
        cy.url({ timeout: 10000 }).should('include', '/auth');

        // Verify error message is displayed to user
        cy.contains('.error__report', 'Session expired');

        // Wait for DELETE_TOKEN to complete and localStorage to be cleared
        cy.window().its('localStorage').invoke('getItem', 'auth-token').should('eq', '');

        // Verify token is deleted from Redux store
        cy.window().its('top').its('appStore').then((store) => {
          expect(store.getState().api.tokens.token).to.equal(null);
        });
      });
    });
  });

  // Note: E2E tests for automatic session extension are complex to implement with Cypress
  // because they require waiting for modal intervals to run (1 second intervals).
  // The core session extension logic is thoroughly covered by unit tests instead.
});
