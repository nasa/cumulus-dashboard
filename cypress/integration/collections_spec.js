const ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');


import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Collections Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/collections');
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    const name = 'TESTCOLLECTION';
    const version = '006';
    beforeEach(() => {
      cy.login();
    });

    after(() => {
      cy.task('resetState');
    });

    it('displays a link to view collections', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Collections').should('exist').as('collections');
      cy.get('@collections').should('have.attr', 'href', '#/collections');
      cy.get('@collections').click();

      cy.url().should('include', 'collections');
      cy.get('.heading--xlarge').should('have.text', 'Collections');

      cy.get('table tbody tr').its('length').should('be.eq', 5);
    });

    it('collections page displays a button to add a new collection', () => {
      cy.visit('/#/collections');

      cy.get('.heading--large').should('have.text', 'Collection Overview');
      cy.contains('a', 'Add a Collection').should('exist').as('addCollection');
      cy.get('@addCollection').should('have.attr', 'href', '#/collections/add');
      cy.get('@addCollection').click();

      // fill the form and submit
      const collection = '{{}"name":"TESTCOLLECTION","version":"006","dataType":"TESTCOLLECTION", "duplicateHandling":"error"}';
      cy.get('textarea').type(collection, {force: true});
      cy.get('form').get('input').contains('Submit').click();

      // displays the new collection
      cy.get('.heading--xlarge').should('have.text', 'Collections');
      cy.get('.heading--large').should('have.text', `${name} / ${version}`);
      cy.url().should('include', `#/collections/collection/${name}/${version}`);

      // verify the new collection is added to the collections list
      cy.contains('a', 'Back to Collections').click();
      cy.contains('table tbody tr a', name)
        .should('exist')
        .and('have.attr', 'href', `#/collections/collection/${name}/${version}`);
    });

    it('collection page has button to edit the collection', () => {
      cy.visit(`/#/collections/collection/${name}/${version}`);
      cy.contains('a', 'Edit').should('exist').as('editCollection');
      cy.get('@editCollection')
        .should('have.attr', 'href')
        .and('include', `#/collections/edit/${name}/${version}`);
      cy.get('@editCollection').click();

      cy.get('.heading--large').should('have.text', `Edit ${name}___${version}`);

      // There are issues updating the react form which uses ace editor.
      // Neither cy .clear nor ace editor works.
      //
      // cy .clear or .type('{selectall}{backspace}' has the following error:
      // CypressError: cy.type() failed because this element is detached from the DOM.
      //
      // ace editor: editor.setValue(collection) does update the value in the ace_content,
      // but doesn't cause the textarea value to be updated, and the updated conent is not submitted
      // with the form.
      // const collection = '{"name":"TESTCOLLECTION","version":"006","dataType":"TESTCOLLECTION", "duplicateHandling":"replace"}';
      // const escapedCollection = collection.replace('{', '{{}');
      // cy.get('textarea')
      //   .type('{selectall}{backspace}', { force: true })
      //   .type(escapedCollection, { force: true });
      // cy.get('.ace_editor').then((ele) => {
      //   const editor = ace.edit(ele[0]);
      //   editor.setValue(collection);
      // });

      // as a workaround, we add additional parameter at the end of collection metadata
      const meta = '"meta": "testmetadata"}';
      cy.get('textarea').type(`{backspace}{backspace},${meta}`, { force: true });

      cy.contains('form input', 'Submit').click();

      // displays the updated collection and its granules
      cy.get('.heading--xlarge').should('have.text', 'Collections');
      cy.get('.heading--large').should('have.text', `${name} / ${version}`);

      // verify the collection is updated by looking at the Edit page
      cy.contains('a', 'Edit').should('exist').click();
      cy.contains('form .ace_content', meta).should('exist');
      cy.get('.heading--large').should('have.text', 'Edit TESTCOLLECTION___006');
    });

    it('collection page has button to delete the collection', () => {
      cy.visit(`/#/collections/collection/${name}/${version}`);

      // delete collection
      cy.contains('button', 'Delete').should('exist').click();
      cy.contains('button', 'Confirm').click();

      // verify the collection is now gone
      cy.url().should('include', 'collections');
      cy.get('.heading--xlarge').should('have.text', 'Collections');
      cy.get(`table tr[data-value="${name}___${version}"]`).should('not.exist');
    });
  });
});
