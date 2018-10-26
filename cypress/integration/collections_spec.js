import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Collections Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/collections');
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login();
      cy.task('resetState');
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
      const name = 'TESTCOLLECTION';
      const version = '006';
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
      const name = 'MOD09GQ';
      const version = '006';
      cy.visit(`/#/collections/collection/${name}/${version}`);
      cy.contains('a', 'Edit').should('exist').as('editCollection');
      cy.get('@editCollection')
        .should('have.attr', 'href')
        .and('include', `#/collections/edit/${name}/${version}`);
      cy.get('@editCollection').click();

      cy.get('.heading--large').should('have.text', `Edit ${name}___${version}`);

      // There are issues updating the react form which uses ace editor.
      // Neither cy .clear nor ace editor works.
      // As a workaround, we add additional parameter at the end of collection metadata
      const meta = '"meta": "testmetadata"}';
      cy.get('textarea').type(`{backspace},${meta}`, { force: true });

      cy.contains('form input', 'Submit').click();

      // displays the updated collection and its granules
      cy.get('.heading--xlarge').should('have.text', 'Collections');
      cy.get('.heading--large').should('have.text', `${name} / ${version}`);

      // verify the collection is updated by looking at the Edit page
      cy.contains('a', 'Edit').should('exist').click();
      cy.contains('form .ace_content', meta).should('exist');
      cy.get('.heading--large').should('have.text', `Edit ${name}___${version}`);
    });

    it('collection page has button to delete the collection', () => {
      const name = 'MOD09GQ';
      const version = '006';
      cy.visit(`/#/collections/collection/${name}/${version}`);

      // delete collection
      cy.contains('button', 'Delete').should('exist').click();
      cy.contains('button', 'Confirm').click();

      // verify the collection is now gone
      cy.url().should('include', 'collections');
      cy.get('.heading--xlarge').should('have.text', 'Collections');
      cy.contains('table tbody tr a', name).should('not.exist');
    });
  });
});
