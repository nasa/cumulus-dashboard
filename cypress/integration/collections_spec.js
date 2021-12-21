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
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.visit('/');
      cy.intercept('POST', '/collections').as('postCollection');
      cy.intercept('GET', '/collections?limit=*').as('getCollections');
      cy.intercept('GET', '/collections/active?limit=*').as('getActiveCollections');
      cy.intercept('GET', '/collections?name=*').as('getCollection');
      cy.intercept('GET', '/granules?limit=*').as('getGranules');
    });

    it('should display a link to view collections', () => {
      cy.contains('nav li a', 'Collections').as('collections');
      cy.setDatepickerDropdown('Recent');
      cy.get('@collections').should('have.attr', 'href').and('match', /\/collections.*startDateTime/);
      cy.get('@collections').click();
      cy.wait('@getActiveCollections');

      cy.url().should('include', 'collections');
      cy.contains('.heading--xlarge', 'Collections');

      cy.get('.table .tbody .tr').should('have.length', 2);
      cy.get('.tbody > .tr > :nth-child(4)').should('contain', '11');
      cy.get('.tbody > .tr > :nth-child(5)').should('contain', '6');
      cy.get('.tbody > .tr > :nth-child(6)').should('contain', '2');
      cy.get('.tbody > .tr > :nth-child(7)').should('contain', '2');
      cy.get('.tbody > .tr > :nth-child(8)').should('contain', '1');

      cy.clearStartDateTime();
      cy.wait('@getCollections');

      cy.get('.table .tbody .tr').should('have.length', 6);
    });

    it('should only display collections with active granules when time filter is applied', () => {
      cy.contains('nav li a', 'Collections').as('collections');
      cy.setDatepickerDropdown('Recent');
      cy.get('@collections').should('have.attr', 'href').and('match', /\/collections.*startDateTime/);
      cy.get('@collections').click();
      cy.wait('@getActiveCollections');

      cy.url().should('include', 'collections');
      cy.contains('.heading--xlarge', 'Collections');

      cy.get('.table .tbody .tr').as('listItems');

      cy.get('@listItems').each(($row) => {
        // verify granule column does not equal 0
        cy.wrap($row).find('.td').eq(3).should('not.eq', '0');
      });

      cy.get('@listItems').find('.td a').eq(0).click();
      cy.wait('@getGranules');

      // verify there is a granule with a timestamp containing second or minute
      // this would indicate it was updated within the default timeframe of 1 hour
      cy.get('@listItems').contains('.td', /[0-9]{2}:[0-9]{2}:[0-9]{2}.+/);
    });

    it('should search collections by name', () => {
      const infix = 'https';
      cy.visit('/collections');
      cy.wait('@getCollections');
      cy.get('.search').as('search');
      cy.get('@search').click().type(infix);
      cy.url().should('include', `search=${infix}`);
      cy.get('.table .tbody .tr').should('have.length', 1);
      cy.get('.table .tbody .tr').eq(0).children('.td').eq(1)
        .contains(infix);
    });

    it('should display collections with active granules when a provider is selected from dropdown', () => {
      cy.visit('/collections');
      cy.wait('@getCollections');

      cy.get('.filter-provider .rbt-input-main').as('provider-input');
      cy.get('@provider-input').click().type('s3').type('{enter}');
      cy.url().should('include', 'provider=s3_provider');
      cy.get('.table .tbody .tr').should('have.length', 2);

      cy.get('@provider-input').click().clear().type('POD')
        .type('{enter}');
      cy.url().should('include', 'provider=PODAAC_SWOT');
      cy.get('.table .tbody .tr').should('not.exist');
    });

    it('should display expected MMT Links for a collections list', () => {
      cy.intercept(
        { method: 'GET', url: /\/collections\?limit=.*/ },
        { fixture: 'collections-with-mmtLinks.json' }
      ).as('getCollections');
      cy.visit('/collections');
      cy.clearStartDateTime();

      cy.get('.table .tbody .tr').should('have.length', 3);

      cy.contains('.table .tbody .tr', 'FAKE09GK')
        .contains('.td a', 'MMT')
        .should('have.attr', 'href')
        .and('eq', 'https://mmt.uat.earthdata.nasa.gov/collections/CFAKE09GK-CUMULUS');

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
      cy.contains('.heading--large', 'Collections Overview');
      cy.clearStartDateTime();
      cy.wait('@getCollections');
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
        .then((interception) => cy.request({
          method: 'GET',
          url: `${new URL(interception.request.url).origin}/collections/${name}/${version}`,
          headers: { Authorization: interception.request.headers.authorization },
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
      const name = 'http_testcollection';
      const version = '001';

      // First visit the collections page in order to fetch the list of
      // collections with which to populate the dropdown on the collection
      // details page.
      cy.visit('/collections');
      cy.wait('@getCollections');
      cy.get('.table .tbody .tr').should('have.length', 6);

      cy.contains('.table .tbody .tr a', name)
        .then(($res) => {
          expect($res).to.have.attr('href', `/collections/collection/${name}/${version}`);
          cy.wrap($res).click();
        });
      cy.contains('.heading--large', `${name} / ${version}`);
      cy.contains('.heading--large', 'Granule Metric');

      const collectionId = getCollectionId({ name: 'MOD09GQ', version: '006' });
      const formattedCollectionName = collectionName(collectionId);

      cy.get('.collection-chooser').click();
      cy.get('.collection-chooser').find('div[class*="option"]').contains(collectionId).click();
      cy.contains('.heading--large', `${formattedCollectionName}`);
      cy.contains('.heading--large', 'Granule Metric');
      cy.get('.collection-chooser').find('div[class*="singleValue"]').contains(collectionId);
    });

    it('should copy a collection', () => {
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/collections/collection/${name}/${version}`);
      cy.wait('@getCollection');
      cy.wait('@getGranules');
      cy.contains('a', 'Copy').as('copyCollection');
      cy.get('@copyCollection')
        .should('have.attr', 'href')
        .and('include', '/collections/add');
      cy.get('@copyCollection').click();

      cy.contains('.heading--large', 'Add a collection');

      // need to make sure defaultValue has been updated with collection json
      cy.contains('.ace_variable', 'name', { timeout: 10000 });
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
      cy.wait('@getCollection');
      cy.wait('@getGranules');
      cy.contains('a', 'Edit').as('editCollection');
      cy.get('@editCollection')
        .should('have.attr', 'href')
        .and('include', `/collections/edit/${name}/${version}`);
      cy.get('@editCollection').click();

      cy.contains('.heading--large', `${name}___${version}`);

      // update collection and submit
      const duplicateHandling = 'version';
      const meta = { metaObj: 'metadata' };
      cy.contains('.ace_variable', 'name', { timeout: 10000 });
      cy.editJsonTextarea({ data: { duplicateHandling, meta }, update: true });
      cy.contains('form button', 'Submit').click();
      cy.contains('.default-modal .edit-collection__title', 'Edit Collection');
      cy.contains('.default-modal .modal-body', `Collection ${name}___${version} has been updated`, { timeout: 10000 });
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

      // Edit Collection should allow for continued editing
      cy.contains('form button', 'Submit').click();
      cy.contains('.default-modal .edit-collection__title', 'Edit Collection');
      cy.contains('.default-modal .modal-body', `Collection ${name}___${version} has encountered an error.`);
      cy.contains('.modal-footer button', 'Continue Editing Collection').click();
      cy.url().should('include', `collections/edit/${name}/${version}`);

      // Cancel Request should return to collection page
      cy.contains('form button', 'Submit').click();
      cy.contains('.modal-footer button', 'Cancel Request').click();
      cy.wait('@getCollection');
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.heading--large', `${name} / ${version}`);
    });

    it('should display an error when attempting to edit a collection name or version', () => {
      const name = 'MOD09GQ';
      const version = '006';

      cy.visit(`/collections/collection/${name}/${version}`);
      cy.wait('@getCollection');
      cy.contains('a', 'Edit').as('editCollection');
      cy.get('@editCollection')
        .should('have.attr', 'href')
        .and('include', `/collections/edit/${name}/${version}`);
      cy.get('@editCollection').click();

      cy.contains('.heading--large', `${name}___${version}`);

      // change name and version
      // Edit Collection should display proper error message
      const newName = 'TEST';
      const newVersion = '2';
      const errorMessage = `Expected collection name and version to be '${name}' and '${version}', respectively, but found '${newName}' and '${newVersion}' in payload`;
      cy.contains('.ace_variable', 'name', { timeout: 10000 });
      cy.editJsonTextarea({ data: { name: newName, version: newVersion }, update: true });
      cy.contains('form button', 'Submit').click();
      cy.contains('.default-modal .edit-collection__title', 'Edit Collection');
      cy.contains('.default-modal .modal-body', `Collection ${name}___${version} has encountered an error.`);
      cy.get('.default-modal .modal-body .error').invoke('text').should('eq', errorMessage);
    });

    it('should delete a collection', () => {
      cy.visit('/');
      const name = 'https_testcollection';
      const version = '001';
      cy.intercept('DELETE', '/collections/https_testcollection/001').as('deleteCollection');

      cy.visit(`/collections/collection/${name}/${version}`);
      cy.clearStartDateTime();
      cy.wait('@getCollection');
      cy.wait('@getGranules');

      // delete collection
      cy.get('.DeleteCollection > .button').click();
      // cancel should close modal and remain on page
      cy.contains('.button', 'Cancel Request')
        .should('be.visible').click();

      cy.contains('.modal-content').should('not.exist');

      // click delete again to show modal again
      cy.get('.DeleteCollection > .button').click();
      // really delete this time instead of cancelling
      cy.contains('.modal button', 'Delete Collection')
        .should('be.visible').click();

      cy.wait('@deleteCollection');

      // click close on confirmation modal
      cy.contains('.modal-footer > .button', 'Close')
        .should('be.visible').click();
      cy.contains('.modal-content').should('not.exist');

      // successful delete should cause navigation back to collections list
      cy.url().should('include', 'collections/all');
      cy.contains('.heading--xlarge', 'Collections');

      // Wait for the table to be visible.
      cy.get('.previous');
      cy.wait('@getCollections');

      // This forces an update to the current state and this seems wrong, but
      // the tests will pass.
      cy.get('.form__element__refresh').click();
      cy.wait('@getCollections');

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
            `[data-value="${collection.name}___${collection.version}"] > .table__main-asset a`,
            { timeout: 25000 }
          ).should(existOrNotExist);
        });
      cy.get('.table .tbody .tr').should('have.length', 5);
      cy.task('resetState');
    });

    it('should fail deleting a collection with an associated rule', () => {
      cy.visit('/');
      const name = 'MOD09GK';
      const version = '006';
      cy.intercept('DELETE', '/collections/MOD09GK/006').as('deleteCollection');

      cy.visit(`/collections/collection/${name}/${version}`);
      cy.clearStartDateTime();
      cy.wait('@getCollection');

      // delete collection
      cy.get('.DeleteCollection > .button').click();

      cy.get('.button__deletecollections')
        .should('be.visible').wait(200).click();

      cy.wait('@deleteCollection');
      // modal error should be displayed indicating that deletion failed
      cy.get('.modal-content .error__report').should('be.visible');
      cy.contains('.modal-footer > .button', 'Close')
        .should('be.visible').wait(200).click();
      cy.contains('.modal-content').should('not.exist');

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
      cy.wait('@getCollection');
      cy.wait('@getGranules');

      // delete collection
      cy.get('.DeleteCollection > .button').click();
      cy.contains('.button__deletecollections', 'Delete Collection')
        .should('be.visible').wait(200).click();

      cy.get('.modal.show > .modal-dialog > .modal-content > .modal-body > p').should('contain', 'must first delete the granules associated with it');

      // modal should ask if user wants to go to granules page
      cy.contains('.button--cancel', 'Cancel Request')
        .should('be.visible').wait(200).click();
      cy.contains('.modal-content').should('not.exist');

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
      cy.wait('@getCollection');
      cy.wait('@getGranules');

      // delete collection
      cy.get('.DeleteCollection > .button').click();
      cy.contains('.button__deletecollections', 'Delete Collection')
        .should('be.visible').wait(200).click();

      // modal should take user to granules page upon clicking 'Go To Granules'
      cy.contains('.button__goto', 'Go To Granules')
        .should('be.visible').wait(200).click();
      cy.contains('.modal-content').should('not.exist');
      cy.url().should('include', 'granules');

      // collection should still exist in list
      cy.contains('a', 'Collections').click();
      cy.contains('.heading--xlarge', 'Collections');
      cy.contains('.table .tbody .tr a', name);
    });

    it('Should fail to reingest granules on a collection detail page', () => {
      cy.visit('/collections/collection/MOD09GQ/006');
      const granuleIds = [
        'MOD09GQ.A0142558.ee5lpE.006.5112577830916',
        'MOD09GQ.A9344328.K9yI3O.006.4625818663028'
      ];
      cy.intercept(
        { method: 'PUT', url: /\/granules\/.*/ },
        { statusCode: 500, body: { message: 'Oopsie' } }
      );
      cy.visit('/granules');
      cy.get(`[data-value="${granuleIds[0]}"] > .td >input[type="checkbox"]`).click();
      cy.get(`[data-value="${granuleIds[1]}"] > .td >input[type="checkbox"]`).click();
      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert', { timeout: 10000 }).should('contain.text', 'Error');
      cy.get('.Collapsible__contentInner').should('contain.text', 'Oopsie');
      cy.get('.button--cancel').click();
      cy.url().should('match', /\/granules/);
      cy.get('.heading--large').should('have.text', 'Granule Overview');
    });

    it('Should reingest multiple granules and redirect to the running page on a collection\'s granule detail page and close the modal', () => {
      cy.visit('/collections/collection/MOD09GQ/006/granules');
      cy.wait('@getGranules');
      const granuleIds = [
        'MOD09GQ.A0142558.ee5lpE.006.5112577830916',
        'MOD09GQ.A9344328.K9yI3O.006.4625818663028'
      ];

      cy.intercept(
        { method: 'PUT', url: /\/granules\/.*/ },
        { statusCode: 200, body: { message: 'ingested' } }
      );

      cy.get(`[data-value="${granuleIds[0]}"] > .td >input[type="checkbox"]`).click();
      cy.get(`[data-value="${granuleIds[1]}"] > .td >input[type="checkbox"]`).click();
      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Reingest').click();
      cy.get('.button--submit').click();
      cy.get('.modal-content .modal-body .alert', { timeout: 10000 }).should('contain.text', 'Success');
      cy.get('.modal-content').within(() => {
        cy.get('.button__goto').click();
      });
      cy.url().should('include', '/collections/collection/MOD09GQ/006/granules/processing');
      cy.get('.heading--medium').should('have.text', 'Running Granules 2');

      // Ensure we have closed the modal.
      cy.get('.modal-content').should('not.exist');
    });

    it('Should display Granule Metrics that match the datepicker selection', () => {
      cy.visit('/collections/collection/MOD09GQ/006');

      cy.get('[data-cy=endDateTime]').within(() => {
        cy.get('input[name=month]').click().type(3);
        cy.get('input[name=day]').click().type(17);
        cy.get('input[name=year]').click().type(2009);
        cy.get('input[name=hour12]').click().type(3);
        cy.get('input[name=minute]').click().type(37);
        cy.get('input[name=minute]').should('have.value', '37');
        cy.get('select[name=amPm]').select('PM');
      });
      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 0).and('contain', 'Completed')
          .next()
          .should('contain', 0)
          .and('contain', 'Failed')
          .next()
          .should('contain', 0)
          .and('contain', 'Running')
          .next()
          .should('contain', 0)
          .and('contain', 'Queued');
      });

      cy.get('[data-cy="endDateTime"] .react-datetime-picker__clear-button__icon').click();

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 6).and('contain', 'Completed')
          .next()
          .should('contain', 2)
          .and('contain', 'Failed')
          .next()
          .should('contain', 2)
          .and('contain', 'Running')
          .next()
          .should('contain', 1)
          .and('contain', 'Queued');
      });
    });

    it('Should display Granule Metrics that match the dropdown selection', () => {
      cy.visit('/collections/collection/MOD09GQ/006');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 6).and('contain', 'Completed')
          .next()
          .should('contain', 2)
          .and('contain', 'Failed')
          .next()
          .should('contain', 2)
          .and('contain', 'Running')
          .next()
          .should('contain', 1)
          .and('contain', 'Queued');
      });

      cy.get('.filter-status .rbt-input-main').as('status-input');
      cy.get('@status-input').click().type('fai').type('{enter}');
      cy.url().should('include', 'status=failed');

      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 0).and('contain', 'Completed')
          .next()
          .should('contain', 2)
          .and('contain', 'Failed')
          .next()
          .should('contain', 0)
          .and('contain', 'Running');
      });
    });

    it('Should display Granules based on provider dropdown selection', () => {
      cy.visit('/collections/collection/MOD09GQ/006');
      cy.get('.filter-provider .rbt-input-main').as('provider-input');

      cy.get('@provider-input').click().type('POD').type('{enter}');
      cy.get('[data-cy=overview-num]').within(() => {
        cy.get('li')
          .first().should('contain', 0).and('contain', 'Completed')
          .next()
          .should('contain', 0)
          .and('contain', 'Failed')
          .next()
          .should('contain', 0)
          .and('contain', 'Running');
      });
    });

    it('Should dynamically update menu, sidbar and breadcrumb links with latest filter criteria', () => {
      cy.visit('/collections/all');
      cy.wait('@getCollections');

      cy.get('.filter-provider .rbt-input-main').as('provider-input');
      cy.get('@provider-input').click().type('s3').type('{enter}');

      cy.get('.search').as('search');
      cy.get('@search').click().type('Test').type('{enter}');

      cy.get('span > a').click();

      // Breakcrumb <Link> contain correct query params
      cy.get('.breadcrumb > :nth-child(2) > a')
        .should('have.attr', 'href')
        .and('include', 'provider=s3_provider')
        .and('include', 'search=Test-L2-Coastal');

      // Menu <Link>s contain correct query params
      cy.get('nav > ul > :nth-child(1) > a')
        .should('have.attr', 'href')
        .and('include', 'provider=s3_provider')
        .and('include', 'search=Test-L2-Coastal');

      // Sidebar <Link>s contain correct query params
      cy.get('.sidebar__nav--back')
        .should('have.attr', 'href')
        .and('include', 'provider=s3_provider')
        .and('include', 'search=Test-L2-Coastal');
    });

    describe('Encoded version', () => {
      const name = 'Test-L2-Coastal';
      const version = 'Operational/Near-Real-Time';
      const encodedVersion = encodeURIComponent(version);
      const urlRegex = new RegExp(`collections/collection/${name}/${encodedVersion}`);
      it('should properly encode collections path', () => {
        cy.visit('/collections');
        cy.get('.table .tbody .tr').should('have.length', 6);
        cy.contains('.table .tbody .tr', name).as('testCollection');
        cy.contains('.table .tbody .tr', version);
        cy.get('@testCollection').find('a').should('have.attr', 'href').and('match', urlRegex);
        cy.get('@testCollection').find('a').click();
        cy.url().should('match', urlRegex);
        cy.contains('.heading--large', `${name} / ${version}`);
        cy.get('.heading--large').should('not.contain', encodedVersion);
        cy.contains('.dropdown__collection', `${name}___${version}`);
      });

      it('should properly query sidebar pages', () => {
        cy.visit(`/collections/collection/${name}/${encodedVersion}`);
        cy.contains('.sidebar a', 'Granules').click();
        cy.get('.table .tbody .tr').should('have.length', 1);
        cy.contains('.sidebar a', 'Completed').click();
        cy.get('.table .tbody .tr').should('have.length', 1);
        cy.contains('.sidebar a', 'Running').click();
        cy.get('.table .tbody .tr').should('have.length', 0);
        cy.contains('.sidebar a', 'Failed').click();
        cy.get('.table .tbody .tr').should('have.length', 0);
      });

      it('should edit a collection', () => {
        cy.visit(`/collections/collection/${name}/${encodedVersion}`);
        cy.wait('@getGranules');
        cy.contains('a', 'Edit').as('editCollection');
        cy.get('@editCollection')
          .should('have.attr', 'href')
          .and('include', `/collections/edit/${name}/${encodedVersion}`);
        cy.get('@editCollection').click();
        cy.contains('.heading--large', `${name}___${version}`);

        // update collection and submit
        const duplicateHandling = 'version';
        const meta = { metaObj: 'metadata' };
        cy.contains('.ace_variable', 'name', { timeout: 10000 });
        cy.editJsonTextarea({ data: { duplicateHandling, meta }, update: true });
        cy.contains('form button', 'Submit').click();
        cy.contains('.default-modal .edit-collection__title', 'Edit Collection');
        cy.contains('.default-modal .modal-body', `Collection ${name}___${version} has been updated`, { timeout: 10000 });
        cy.contains('.modal-footer button', 'Close').click();

        // displays the updated collection and its granules
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
      });

      it('should add and delete a new collection', () => {
        const newName = 'TESTCOLLECTION';
        const newVersion = 'Test/006';
        const newEncodedVersion = encodeURIComponent(newVersion);
        cy.intercept('DELETE', `/collections/${newName}/${newEncodedVersion}`).as('deleteCollection');
        // Test collection loaded by cy.fixture
        let collection;

        // On the Collections page, click the Add Collection button
        cy.visit('/collections');
        cy.contains('.heading--large', 'Collections Overview');
        cy.clearStartDateTime();
        cy.wait('@getCollections');
        cy.contains('a', 'Add Collection').click();

        // Fill the form with the test collection JSON and submit it
        cy.url().should('include', '/collections/add');
        cy.fixture('TESTCOLLECTION___Test%2F006.json')
          .then((json) => {
            cy.editJsonTextarea({ data: json });
            // Capture the test collection so we can confirm below that it was
            // properly persisted after form submission.
            collection = json;
          });
        cy.contains('form button', 'Submit').click();

        // After POSTing the new collection, make sure we GET it back
        cy.wait('@postCollection')
          .then((interception) => cy.request({
            method: 'GET',
            url: `${new URL(interception.request.url).origin}/collections/${newName}/${newEncodedVersion}`,
            headers: { Authorization: interception.request.headers.authorization },
          }))
          .then((response) => {
            cy.expectDeepEqualButNewer(response.body, collection);

            // Display the new collection
            cy.wait('@getGranules');
            cy.url().should('include', `/collections/collection/${newName}/${newEncodedVersion}`);
            cy.contains('.heading--xlarge', 'Collections');
            cy.contains('.heading--large', `${newName} / ${newVersion}`);

            // Verify the new collection appears in the collections list, after
            // allowing ES indexing to finish (hopefully), so that the new
            // collection is part of the query results.
            cy.wait(1000);
            cy.contains('Back to Collections').click();
            cy.wait('@getCollections');
            cy.url().should('contain', '/collections/all');
            cy.contains('.table .tbody .tr a', newName)
              .should('have.attr', 'href', `/collections/collection/${newName}/${newEncodedVersion}`);

            cy.visit(`/collections/collection/${newName}/${newEncodedVersion}`);

            // delete collection
            cy.get('.DeleteCollection > .button').click();
            cy.contains('.modal button', 'Delete Collection')
              .should('be.visible').click();
            cy.wait('@deleteCollection');

            // click close on confirmation modal
            cy.contains('.modal-footer > .button', 'Close')
              .should('be.visible').click();
            cy.contains('.modal-content').should('not.exist');

            // successful delete should cause navigation back to collections list
            cy.url().should('include', 'collections/all');
            cy.contains('.heading--xlarge', 'Collections');

            // Wait for the table to be visible.
            cy.get('.previous');
            cy.wait('@getCollections');

            // This forces an update to the current state and this seems wrong, but
            // the tests will pass.
            cy.get('.form__element__refresh').click();
            cy.wait('@getCollections');

            // This timeout exists because the table is sometimes re-rendered
            // with existing information, and the next update has to happen
            // before these all show up or don't show up correctly.
            cy.get(
                `[data-value="${newName}___${newVersion}"]`,
                { timeout: 25000 }
            ).should('not.exist');
            cy.task('resetState');
          });
      });
    });
  });
});
