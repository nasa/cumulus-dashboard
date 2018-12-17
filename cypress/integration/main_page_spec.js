import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Home Page', () => {
  it('When not logged in it should redirect to login page', () => {
    cy.visit('/');
    shouldBeRedirectedToLogin();
  });

  describe('When logged in', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('div[class=modal__internal]').within(() => {
          cy.get('a').click();
      });
    });

    after(() => {
      cy.task('resetState');
    });

    it('successfully redirects to the Dashboard main page', () => {
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

    it('displays a compatible Cumulus API Version number', () => {
      const apiVersion = '1.11.0';
      cy.get('h5[class=apiVersion]').should((apiVersionWrapper) => {
        expect(apiVersionWrapper.first()).to.contain(apiVersion)
      });
    });
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
  });
});
