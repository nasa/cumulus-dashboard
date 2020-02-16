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
process.env.TOKEN_SECRET = 'myDashboardSecret';
import clonedeep from 'lodash.clonedeep';
import { DELETE_TOKEN } from '../../app/src/js/actions/types';
import { createJwtToken } from '@cumulus/api/lib/token';

Cypress.Commands.add('login', () => {
  const accessToken = 'random';
  const expirationTime = new Date(Date.now() + 3600 * 24 * 1000);
  const username = 'testUser';
  const token = createJwtToken({accessToken, expirationTime, username});
  window.localStorage.setItem('auth-token', token);
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
    if (update) {
      const value = editor.getValue();
      let currentObject = JSON.parse(value);
      data = Cypress._.assign(currentObject, data);
    }
    data = JSON.stringify(data);
    editor.setValue(data);
  });
});

Cypress.Commands.add('getJsonTextareaValue', () => {
  return cy.window().its('aceEditorRef').its('editor').then((editor) => {
    const value = editor.getValue();
    return JSON.parse(value);
  });
});

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
  const newObject = clonedeep(inewObject);
  const fixtureObject = clonedeep(ifixtureObject);
  expect(newObject['updatedAt']).to.be.greaterThan(fixtureObject['updatedAt']);
  delete newObject['updatedAt'];
  delete fixtureObject['updatedAt'];
  expect(newObject).to.deep.equal(fixtureObject);
});
