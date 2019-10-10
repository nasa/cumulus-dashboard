import { shouldBeRedirectedToLogin } from '../support/assertions';

describe('Dashboard Collections Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/#/collections');
      shouldBeRedirectedToLogin();

      const name = 'MOD09GQ';
      const version = '006';
      cy.visit(`/#/collections/collection/${name}/${version}`);
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login();
      cy.task('resetState');
      cy.server();
      cy.route('POST', '/collections').as('postCollection');
      cy.route('GET', '/collections?limit=*').as('getCollections');
      cy.route('GET', '/collections?name=*').as('getCollection');
      cy.route('GET', '/granules?limit=*').as('getGranules');

      // Stub CMR response to avoid hitting UAT
      cy.fixture('cmr')
        .then((fixture) => fixture.forEach((options) => cy.route(options)));
    });

    after(() => {
      cy.task('resetState');
    });

    it('should display a link to view collections', () => {
      cy.visit('/');

      cy.contains('nav li a', 'Collections').as('collections');
      cy.get('@collections').should('have.attr', 'href', '#/collections');
      cy.get('@collections').click();

      cy.url().should('include', 'collections');
      cy.contains('.heading--xlarge', 'Collections');

      cy.get('table tbody tr').its('length').should('be.eq', 5);
    });

    it('should display expected MMT Links for collections list', () => {
      cy.visit('/#/collections');

      cy.get('table tbody tr').its('length').should('be.eq', 5);

      cy.contains('table tbody tr', 'MOD09GQ')
        .contains('td a', 'MMT')
        .should('have.attr', 'href')
        .and('eq', 'https://mmt.uat.earthdata.nasa.gov/collections/CMOD09GQ-CUMULUS');

      cy.contains('table tbody tr', 'L2_HR_PIXC')
        .contains('td a', 'MMT')
        .should('have.attr', 'href')
        .and('eq', 'https://mmt.uat.earthdata.nasa.gov/collections/CL2_HR_PIXC-CUMULUS');
    });

    it('should add a new collection', () => {
      const name = 'TESTCOLLECTION';
      const version = '006';
      // Test collection loaded by cy.fixture
      let collection;

      // On the Collections page, click the Add Collection button
      cy.visit('/#/collections');
      cy.contains('.heading--large', 'Collection Overview');
      cy.contains('a', 'Add a Collection').click();

      // Fill the form with the test collection JSON and submit it
      cy.hash().should('eq', '#/collections/add');
      cy.fixture('TESTCOLLECTION___006.json')
        .then((json) => {
          cy.editJsonTextarea({ data: json });
          // Capture the test collection so we can confirm below that it was
          // properly persisted after form submission.
          collection = json;
        });
      cy.contains('form button', 'Submit').click();

      // After POSTing the new collection, make sure we GET it back
      cy.wait('@postCollection')
        .then((xhr) =>
          cy.request({
            method: 'GET',
            url: `${new URL(xhr.url).origin}/collections/${name}/${version}`,
            headers: xhr.request.headers
          }))
        .then((response) => expect(response.body).to.deep.equal(collection));

      // Display the new collection
      cy.wait('@getCollection');
      cy.wait('@getGranules');
      cy.hash().should('eq', `#/collections/collection/${name}/${version}`);
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.heading--large', `${name} / ${version}`);
      cy.get('table tbody tr[data-value]');

      // Verify the new collection appears in the collections list
      cy.contains('Back to Collections').click();
      cy.wait('@getCollections');
      cy.hash().should('eq', '#/collections/all');
      cy.contains('table tbody tr a', name)
        .should('have.attr', 'href',
          `#/collections/collection/${name}/${version}`);
    });

    it('should edit a collection', () => {
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/#/collections/collection/${name}/${version}`);
      cy.contains('a', 'Edit').as('editCollection');
      cy.get('@editCollection')
        .should('have.attr', 'href')
        .and('include', `#/collections/edit/${name}/${version}`);
      cy.get('@editCollection').click();

      cy.contains('.heading--large', `Edit ${name}___${version}`);

      // update collection and submit
      const duplicateHandling = 'version';
      const meta = 'metadata';
      cy.editJsonTextarea({ data: { duplicateHandling, meta }, update: true });
      cy.contains('form button', 'Submit').click();

      // displays the updated collection and its granules
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.heading--large', `${name} / ${version}`);

      // verify the collection is updated by looking at the Edit page
      cy.contains('a', 'Edit').click();

      cy.getJsonTextareaValue().then((collectionJson) => {
        expect(collectionJson.duplicateHandling).to.equal(duplicateHandling);
        expect(collectionJson.meta).to.equal(meta);
      });
      cy.contains('.heading--large', `Edit ${name}___${version}`);
    });

    it('should delete a collection', () => {
      const name = 'MOD09GK';
      const version = '006';

      cy.visit(`/#/collections/collection/${name}/${version}`);

      // delete collection
      cy.contains('button', 'Delete').click();
      cy.contains('button', 'Confirm').click();

      // verify the collection is now gone
      cy.url().should('include', 'collections');
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('table tbody tr a', name).should('not.exist');
    });

    it('should fail deleting a collection with an associated rule', () => {
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/#/collections/collection/${name}/${version}`);

      // delete collection
      cy.contains('button', 'Delete').click();
      cy.contains('button', 'Confirm').click();

      // error should be displayed indicating that deletion failed
      cy.get('.error__report');

      // collection should still exist in list
      cy.contains('a', 'Back to Collections').click();
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('table tbody tr a', name);
    });
  });
});
