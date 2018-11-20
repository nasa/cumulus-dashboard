import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard authentication', () => {
  describe('When token refresh fails', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should redirect to login page', () => {
      cy.visit('/');

      cy.task('generateJWT', {
        expiresIn: -10
      }).then(() => {
        cy.request({
          url: `${Cypress.env('APIROOT')}/granules`,
          auth: {
            bearer: window.localStorage.getItem('auth-token')
          }
        });
      });
    });
  });
});
