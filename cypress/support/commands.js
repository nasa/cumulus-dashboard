// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  return cy.request({
    url: 'http://localhost:5001/token?state=http%3A%2F%2Flocalhost%3A3000%2F%23%2Fauth',
    followRedirect: false
  }).then((response) => {
    const query = response.redirectedToUrl.substr(response.redirectedToUrl.indexOf('?') + 1);
    const token = query.split('=')[1];
    window.localStorage.setItem('auth-token', token);
  });
});
