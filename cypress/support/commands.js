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
import 'cypress-wait-until';
import cloneDeep from 'lodash/cloneDeep';
import { DELETE_TOKEN, SET_TOKEN } from '../../app/src/js/actions/types';

Cypress.Commands.add('login', () => {
  const authUrl = `${Cypress.config('baseUrl')}/auth`;
  cy.request({
    url: `${Cypress.env('APIROOT')}/token?code=somecode`,
    qs: {
      state: encodeURIComponent(authUrl)
    },
    followRedirect: true
  }).then((response) => {
    // mhs: When we get rid of the hash in the urls, we can just use url.parse()
    const redirectStr = response.redirects[response.redirects.length - 1];
    const redirectUrl = redirectStr.split(': ')[1];
    const queryStr = redirectUrl.split('?')[1];
    const token = queryStr.split('=')[1];
    cy.window().its('appStore').then((store) => {
      store.dispatch({
        type: SET_TOKEN,
        token
      });
    });
  });
});

Cypress.Commands.add('logout', () => {
  cy.window().its('appStore')
    .then((store) => {
      store.dispatch({
        type: DELETE_TOKEN
      });
    });
  cy.reload();
});

Cypress.Commands.add('editJsonTextarea', ({ data, update = false }) => {
  cy.window().its('aceEditorRef').its('editor').then((editor) => {
    let editedData = data;
    if (update) {
      const value = editor.getValue();
      const currentObject = JSON.parse(value);
      editedData = Cypress._.assign(currentObject, editedData);
    }
    editedData = JSON.stringify(editedData);
    editor.setValue(editedData);
  });
});

Cypress.Commands.add('getJsonTextareaValue', () => cy.window().its('aceEditorRef').its('editor').then((editor) => {
  const value = editor.getValue();
  return JSON.parse(value);
}));

/**
 * Adds a cypress command to read database seed fixture
 * example: `cy.getFakeApiFixture('granules')`
 */
Cypress.Commands.add('getFakeApiFixture', (fixtureName) => {
  const fixtureFile = `cypress/fixtures/seeds/${fixtureName}Fixture.json`;
  return cy.readFile(fixtureFile);
});

/**
 * Adds a cypress command to read a standard cypress fixture file.
 * example: `cy.getFixture('fixtureFile')`
 */
Cypress.Commands.add('getFixture', (fixtureName) => {
  const fixtureFile = `cypress/fixtures/${fixtureName}.json`;
  return cy.readFile(fixtureFile);
});

/**
 * Adds custom command to compare two objects, where they are the same except
 * for the updatedAt time must be newer on the new object.
 */
Cypress.Commands.add('expectDeepEqualButNewer', (inewObject, ifixtureObject) => {
  const newObject = cloneDeep(inewObject);
  const fixtureObject = cloneDeep(ifixtureObject);
  expect(newObject.updatedAt).to.be.greaterThan(fixtureObject.updatedAt);
  delete newObject.updatedAt;
  delete fixtureObject.updatedAt;
  delete newObject.createdAt;
  delete fixtureObject.createdAt;
  expect(newObject).to.deep.equal(fixtureObject);
});

/**
 * Adds custom command to clear the default startDate filter
 */
Cypress.Commands.add('clearStartDateTime', () => {
  cy.get('li[data-cy="startDateTime"]').find('.react-datetime-picker__clear-button').click();
});

/**
 * Add custom command to set the dropdown value to any value.
 */
Cypress.Commands.add('setDatepickerDropdown', (targetValue) => {
  cy.get('.datetime.dropdown__dtrange').click();
  cy.contains('div[id*="react-select"]', targetValue).click();
});
