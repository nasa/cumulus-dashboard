import { shouldBeRedirectedToLogin } from '../support/assertions';
import { listGranules, SET_TOKEN } from '../../app/scripts/actions';

describe('Dashboard authentication', () => {
  describe('Token refresh', () => {
    beforeEach(() => {
      // make sure to visit app before cy.login() so that reference to
      // data store exists on window.appStore
      cy.visit('/');
      cy.login();
    });

    it('should logout user on invalid token', () => {
      cy.window().its('appStore').then((store) => {
        // Dispatch an action to set the token
        store.dispatch({
          type: SET_TOKEN,
          token: 'invalid-token'
        });
        // Dispatch an action to request granules. It should fail
        // and log the user out when it recognizes the invalid token.
        store.dispatch(listGranules);
      });

      shouldBeRedirectedToLogin();
      cy.contains('.error__report', 'Invalid token');
    });

    it('should logout user on failed token refresh', () => {
      cy.server();
      cy.route({
        method: 'POST',
        url: `${Cypress.env('APIROOT')}/refresh`,
        status: 500,
        response: {}
      });

      cy.window().its('appStore').then((store) => {
        cy.task('generateJWT', { expiresIn: -10 }).then((expiredJwt) => {
          store.dispatch({
            type: SET_TOKEN,
            token: expiredJwt
          });

          store.dispatch(listGranules);
        });
      });

      shouldBeRedirectedToLogin();
      cy.contains('.error__report', 'Session expired');
    });
  });
});
