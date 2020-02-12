import {
  shouldBeLoggedIn,
  shouldBeRedirectedToLogin,
  shouldHaveNoToken,
  shouldHaveDeletedToken
} from '../support/assertions';

import { API_VERSION } from '../../app/src/js/actions/types';

describe('Dashboard Home Page', () => {
  it('When not logged in it should redirect to login page', () => {
    cy.visit('/');
    shouldBeRedirectedToLogin();
    shouldHaveNoToken();
  });

  it('Logging in successfully redirects to the Dashboard main page', () => {
    cy.visit('/');
    cy.get('div[class=modal-content]').within(() => {
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

    cy.get('div[class=modal-content]').within(() => {
      cy.get('a').click();
    });

    shouldBeLoggedIn();
  });

  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
    });

    beforeEach(() => {
      // Logging to debug intermittent timeouts
      cy.task('log', 'Login');
      cy.login();
      cy.task('log', 'Login complete');
      cy.visit('/');
      cy.task('log', 'Visit main page complete');
    });

    afterEach(() => {
      // Cypress can sometimes have weird timeout issues if you try to
      // cy.visit() the URL you are already on. To avoid this problem,
      // we log out after each test and reload to the /auth page, so that
      // cy.visit('/') should always work.
      //
      // https://github.com/cypress-io/cypress/issues/1311#issuecomment-393896371

      // Logging to debug intermittent timeouts
      cy.task('log', 'Logout');
      cy.logout();
      cy.task('log', 'Logout complete');
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

    xit('displays a date picker in metrics section', () => {
      cy.get('main[class=main] section').eq(1).within(() => {
        cy.get('h3').should('have.text', 'Date and Time Range');

        cy.get('div[class=datetime] ul li select[name=dateRange]').as('dateRange');
        cy.get('@dateRange').select('1 week', { force: true });
        cy.url().should('include', 'dateRange=1+week');

        cy.get('div[class=datetime] ul li').eq(1).within(() => {
          cy.get('div input').as('datetimeinputs');
          cy.get('@datetimeinputs').eq(1).click({ force: true }).type('2');
          cy.get('@datetimeinputs').eq(2).click({ force: true }).type('19');
          cy.get('@datetimeinputs').eq(3).click({ force: true }).type('2019');
          cy.get('@datetimeinputs').eq(4).click({ force: true }).type('6');
          cy.get('@datetimeinputs').eq(5).click({ force: true }).type('59');
          cy.get('div select[name=amPm]').select('PM', { force: true });
          cy.url().should('include', 'startDateTime=2019-02-19T18%3A59%3A00Z');
        });

        cy.get('div[class=datetime__clear] button').click({ force: true });
        cy.url().should('not.include', 'dateRange=1+week');
        cy.url().should('not.include', 'startDateTime=2019-02-19T18%3A59%3A00Z');
      });
    });

    it('Logging out successfully redirects to the login screen', () => {
      // Logging to debug intermittent timeouts
      cy.task('log', 'Start test');

      cy.get('nav li').last().within(() => {
        cy.get('a').should('have.text', 'Log out');
      });

      cy.task('log', 'Click');

      cy.get('nav li').last().click();
      cy.url().should('include', '/#/auth');

      cy.task('log', 'Visit collections');

      cy.visit('#/collections');

      cy.url().should('not.include', '/#/collections');
      cy.url().should('include', '/#/auth');

      shouldHaveDeletedToken();
    });
  });
});
