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
  const authUrl = `${Cypress.config('baseUrl')}/#/auth`;
  cy.request({
    url: `${Cypress.env('APIROOT')}/token`,
    qs: {
      state: encodeURIComponent(authUrl)
    },
    followRedirect: false
  }).then((response) => {
    const query = response.redirectedToUrl.substr(response.redirectedToUrl.indexOf('?') + 1);
    const token = query.split('=')[1];
    cy.window()
      .its('localStorage')
      .invoke('setItem', 'auth-token', token);
  });
});

Cypress.Commands.add('editTextarea', (overrides) => {
  cy.window().its('aceEditorRef').its('editor').then((editor) => {
    const value = editor.getValue();
    // this should not be necessary
    // const { JSON } = window;
    let data = JSON.parse(value);
    data = Cypress._.assign(data, overrides);
    data = JSON.stringify(data);
    editor.setValue(data);
  });
});
