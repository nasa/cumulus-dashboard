import { shouldBeRedirectedToLogin } from '../support/assertions';
import { login, SET_TOKEN } from '../../app/scripts/actions';

describe('Dashboard authentication', () => {
  describe('Token refresh', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should fail and redirect to login page for invalid token', () => {
      cy.visit('/');

      cy.window().its('appStore').then((store) => {
        store.dispatch({
          type: SET_TOKEN,
          token: 'invalid-token'
        });
        store.dispatch(login);
      });

      shouldBeRedirectedToLogin();
      cy.contains('.error__report', 'Invalid token');
    });

    it.only('should redirect to login page for failed request', () => {
      cy.server();
      cy.route({
        method: 'POST',
        url: `${Cypress.env('APIROOT')}/refresh`,
        status: 500,
        response: {}
      });

      cy.visit('/');

      cy.window().its('appStore').then((store) => {
        store.dispatch(login);
      });

      shouldBeRedirectedToLogin();
      cy.contains('.error__report', 'Session expired');
    });
  });
});
