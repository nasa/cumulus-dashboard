import { shouldBeRedirectedToLogin } from '../support/assertions';
import { collectionName, getCollectionId } from '../../app/src/js/utils/format';

describe('Dashboard Collections Page', () => {
  describe('When not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/collections');
      shouldBeRedirectedToLogin();

      const name = 'MOD09GQ';
      const version = '006';
      cy.visit(`/collections/collection/${name}/${version}`);
      shouldBeRedirectedToLogin();
    });
  });

  describe('When logged in', () => {
    let cmrFixtureIdx;
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.visit('/');
      cy.server();
      cy.route('POST', '/collections').as('postCollection');
      cy.route('GET', '/collections?limit=*').as('getCollections');
      cy.route('GET', '/collections?name=*').as('getCollection');
      cy.route('GET', '/granules?limit=*').as('getGranules');

      // Stub CMR response to avoid hitting UAT
      cmrFixtureIdx = 0;
      cy.fixture('cmr').then((fixture) => fixture.forEach((f) => cy.route(f).as(`cmr${cmrFixtureIdx++}`)));
    });

    it('should display a link to view collections', () => {
      cy.contains('nav li a', 'Collections').as('collections');
      cy.get('@collections').should('have.attr', 'href', '/collections');
      cy.get('@collections').click();
      cy.wait('@getCollections');

      cy.url().should('include', 'collections');
      cy.contains('.heading--xlarge', 'Collections');

      cy.get('.table .tbody .tr').its('length').should('be.eq', 5);
    });

    it('should display expected MMT Links for collections list', () => {
      cy.visit('/collections');
      cy.wait('@getCollections');
      let i = 0;

      cy.get('.table .tbody .tr').its('length').should('be.eq', 5);

      while (i < cmrFixtureIdx) cy.wait(`@cmr${i++}`, {timeout: 25000});
      cy.contains('.table .tbody .tr', 'MOD09GQ')
        .contains('.td a', 'MMT')
        .should('have.attr', 'href')
        .and('eq', 'https://mmt.uat.earthdata.nasa.gov/collections/CMOD09GQ-CUMULUS');

      cy.contains('.table .tbody .tr', 'L2_HR_PIXC')
        .contains('.td a', 'MMT')
        .should('have.attr', 'href')
        .and('eq', 'https://mmt.uat.earthdata.nasa.gov/collections/CL2_HR_PIXC-CUMULUS');
    });

    it('should add a new collection', () => {
      const name = 'TESTCOLLECTION';
      const version = '006';
      // Test collection loaded by cy.fixture
      let collection;

      // On the Collections page, click the Add Collection button
      cy.visit('/collections');
      cy.contains('.heading--large', 'Collection Overview');
      cy.contains('a', 'Add Collection').click();

      // Fill the form with the test collection JSON and submit it
      cy.url().should('include', '/collections/add');
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
        .then((response) => {
          cy.expectDeepEqualButNewer(response.body, collection);

          // Display the new collection
          cy.wait('@getCollection');
          cy.wait('@getGranules');
          cy.url().should('include', `/collections/collection/${name}/${version}`);
          cy.contains('.heading--xlarge', 'Collections');
          cy.contains('.heading--large', `${name} / ${version}`);

          // Verify the new collection appears in the collections list, after
          // allowing ES indexing to finish (hopefully), so that the new
          // collection is part of the query results.
          cy.wait(1000);
          cy.contains('Back to Collections').click();
          cy.wait('@getCollections');
          cy.url().should('contain', '/collections/all');
          cy.contains('.table .tbody .tr a', name)
            .should('have.attr', 'href', `/collections/collection/${name}/${version}`);
        });
      cy.task('resetState');
    });

    it('should select a different collection', () => {
      let name = 'http_testcollection';
      let version = '001';

      // First visit the collections page in order to fetch the list of
      // collections with which to populate the dropdown on the collection
      // details page.
      cy.visit('/collections');
      cy.wait('@getCollections');
      cy.get('.table .tbody .tr').its('length').should('be.eq', 5);

      cy.contains('.table .tbody .tr a', name)
        .should('have.attr', 'href', `/collections/collection/${name}/${version}`)
        .click();
      cy.contains('.heading--large', `${name} / ${version}`);
      cy.contains(/Granules? Running/i);

      const collectionId = getCollectionId({ name: 'MOD09GQ', version: '006' });
      const formattedCollectionName = collectionName(collectionId);

      cy.get('#collection-chooser').select(collectionId);
      cy.contains('.heading--large', `${formattedCollectionName}`);
      cy.contains(/Granules? Running/i);
      cy.get('#collection-chooser').find(':selected').contains(collectionId);
    });

    it('should copy a collection', () => {
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/collections/collection/${name}/${version}`);
      cy.contains('a', 'Copy').as('copyCollection');
      cy.get('@copyCollection')
        .should('have.attr', 'href')
        .and('include', '/collections/add');
      cy.get('@copyCollection').click();

      cy.contains('.heading--large', 'Add a collection');

      // need to make sure defaultValue has been updated with collection json
      cy.contains('.ace_variable', 'name');
      cy.getJsonTextareaValue().then((jsonValue) => {
        expect(jsonValue.version).to.equal(version);
      });

      // update collection and submit
      const newVersion = '007';
      cy.editJsonTextarea({ data: { version: newVersion }, update: true });
      cy.contains('form button', 'Submit').click();

      // should navigate to copied collections page
      cy.url().should('include', `/collections/collection/${name}/${newVersion}`);

      // displays the copied collection and its granules
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.heading--large', `${name} / ${newVersion}`);
      cy.task('resetState');
    });

    it('should edit a collection', () => {
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/collections/collection/${name}/${version}`);
      cy.contains('a', 'Edit').as('editCollection');
      cy.get('@editCollection')
        .should('have.attr', 'href')
        .and('include', `/collections/edit/${name}/${version}`);
      cy.get('@editCollection').click();

      cy.contains('.heading--large', `${name}___${version}`);

      // update collection and submit
      const duplicateHandling = 'version';
      const meta = {metaObj: 'metadata'};
      cy.contains('.ace_variable', 'name');
      cy.editJsonTextarea({ data: { duplicateHandling, meta }, update: true });
      cy.contains('form button', 'Submit').click();
      cy.contains('.default-modal .edit-collection__title', 'Edit Collection');
      cy.contains('.default-modal .modal-body', `Collection ${name} / ${version} has been updated`);
      cy.contains('.modal-footer button', 'Close').click();

      // displays the updated collection and its granules
      cy.wait('@getCollection');
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.heading--large', `${name} / ${version}`);

      // verify the collection is updated by looking at the Edit page
      cy.contains('a', 'Edit').click();

      cy.contains('.ace_variable', 'name');
      cy.getJsonTextareaValue().then((collectionJson) => {
        expect(collectionJson.duplicateHandling).to.equal(duplicateHandling);
        expect(collectionJson.meta).to.deep.equal(meta);
      });
      cy.contains('.heading--large', `${name}___${version}`);

      // Test error flow
      const sampleFileName = 'test';
      cy.contains('.ace_variable', 'name');
      cy.editJsonTextarea({ data: { sampleFileName }, update: true });

      // Go To Collection should allow for continued editing
      cy.contains('form button', 'Submit').click();
      cy.contains('.default-modal .edit-collection__title', 'Edit Collection');
      cy.contains('.default-modal .modal-body', `Collection ${name} / ${version} has encountered an error.`);
      cy.contains('.modal-footer button', 'Go To Collection').click();
      cy.url().should('include', `collections/edit/${name}/${version}`);

      // Cancel Request should return to collection page
      cy.contains('form button', 'Submit').click();
      cy.contains('.modal-footer button', 'Cancel Request').click();
      cy.wait('@getCollection');
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.heading--large', `${name} / ${version}`);
    });

    it('should delete a collection', () => {
      cy.visit('/');
      const name = 'https_testcollection';
      const version = '001';
      cy.route('DELETE', '/collections/https_testcollection/001').as('deleteCollection');

      cy.visit(`/collections/collection/${name}/${version}`);

      // delete collection
      cy.get('.DeleteCollection > .button').click();
      // cancel should close modal and remain on page
      cy.contains('.button', 'Cancel Request')
        .should('be.visible').click();

      cy.contains('.modal-content').should('not.be.visible');

      // click delete again to show modal again
      cy.get('.DeleteCollection > .button').click();
      // really delete this time instead of cancelling
      cy.contains('.modal button', 'Delete Collection')
        .should('be.visible').click();

      cy.wait('@deleteCollection');

      // click close on confirmation modal
      cy.contains('.modal-footer > .button', 'Close')
        .should('be.visible').click();
      cy.contains('.modal-content').should('not.be.visible');

      // successful delete should cause navigation back to collections list
      cy.url().should('include', 'collections/all');
      cy.contains('.heading--xlarge', 'Collections');

      // Wait for the table to be visible.
      cy.get('.previous');

      // This forces an update to the current state and this seems wrong, but
      // the tests will pass.
      cy.get('.form__element__refresh').click();

      cy.getFakeApiFixture('collections').its('results')
        .each((collection) => {
          // ensure each fixture is still in the table except the deleted collection
          let existOrNotExist = 'exist';
          if ((collection.name) === name) {
            existOrNotExist = 'not.exist';
          }
          // This timeout exists because the table is sometimes re-rendered
          // with existing information, and the next update has to happen
          // before these all show up or don't show up correctly.
          cy.get(
            `[data-value="${collection.name}___${collection.version}"] > .table__main-asset > a`,
            {timeout: 25000}).should(existOrNotExist);
        });
      cy.get('.table .tbody .tr').its('length').should('be.eq', 4);
      cy.task('resetState');
    });

    it('should fail deleting a collection with an associated rule', () => {
      cy.visit('/');
      const name = 'MOD09GK';
      const version = '006';
      cy.route('DELETE', '/collections/MOD09GK/006').as('deleteCollection');

      cy.visit(`/collections/collection/${name}/${version}`);

      // delete collection
      cy.get('.DeleteCollection > .button').click();

      cy.get('.button__deletecollections')
        .should('be.visible').wait(200).click();

      cy.wait('@deleteCollection');
      // modal error should be displayed indicating that deletion failed
      cy.get('.modal-content .error__report').should('be.visible');
      cy.contains('.modal-footer > .button', 'Close')
        .should('be.visible').wait(200).click();
      cy.contains('.modal-content').should('not.be.visible');

      // collection should still exist in list
      cy.contains('a', 'Back to Collections').click();
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.table .tbody .tr a', name);
    });

    it('should do nothing on cancel when deleting a collection with associated granules', () => {
      cy.visit('/');
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/collections/collection/${name}/${version}`);

      // delete collection
      cy.get('.DeleteCollection > .button').click();
      cy.contains('.button__deletecollections', 'Delete Collection')
        .should('be.visible').wait(200).click();

      // modal should ask if user wants to go to granules page
      cy.contains('.button--cancel', 'Cancel Request')
        .should('be.visible').wait(200).click();
      cy.contains('.modal-content').should('not.be.visible');

      // collection should still exist in list
      cy.contains('a', 'Back to Collections').click();
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.table .tbody .tr a', name);
    });

    it('should go to granules upon request when deleting a collection with associated granules', () => {
      cy.visit('/');
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/collections/collection/${name}/${version}`);

      // delete collection
      cy.get('.DeleteCollection > .button').click();
      cy.contains('.button__deletecollections', 'Delete Collection')
        .should('be.visible').wait(200).click();

      // modal should take user to granules page upon clicking 'Go To Granules'
      cy.contains('.button__goto', 'Go To Granules')
        .should('be.visible').wait(200).click();
      cy.contains('.modal-content').should('not.be.visible');
      cy.url().should('include', 'granules');

      // collection should still exist in list
      cy.contains('a', 'Collections').click();
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.table .tbody .tr a', name);
    });
  });
});
