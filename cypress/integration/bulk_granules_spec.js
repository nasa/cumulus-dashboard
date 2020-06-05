describe('Dashboard Bulk Granules', () => {
  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.visit('/');
    });

    it('should display a modal to choose a bulk granules operation', () => {
      cy.visit('/granules');
      cy.contains('button', 'Run Bulk Granules').click();

      cy.get('.bulk_granules')
        .within(() => {
          cy.contains('button', 'Run Bulk Delete');
          cy.contains('button', 'Run Bulk Operations');
        });
    });

    it('handles a successful bulk granule operation request', () => {
      const asyncOperationId = Math.floor(Math.random() * 10);

      cy.server();
      cy.route('POST', '/granules/bulk', {
        id: asyncOperationId
      }).as('postBulkGranules');

      cy.visit('/granules');
      cy.contains('button', 'Run Bulk Granules').click();

      cy.get('.bulk_granules')
        .within(() => {
          cy.contains('button', 'Run Bulk Operations').click();
        });

      cy.get('.bulk_granules--operations')
        .within(() => {
          cy.contains('button', 'Cancel Bulk Operations');
          cy.contains('button', 'Run Bulk Operations').click();
        });

      cy.wait('@postBulkGranules');
      cy.contains('p', asyncOperationId);
      cy.contains('button', 'Go To Operations');
    });

    it('handles successful bulk granule deletion request', () => {
      const asyncOperationId = Math.floor(Math.random() * 10);

      cy.server();
      cy.route('POST', '/granules/bulkDelete', {
        id: asyncOperationId
      }).as('postBulkDelete');

      cy.visit('/granules');
      cy.contains('button', 'Run Bulk Granules').click();

      cy.get('.bulk_granules')
        .within(() => {
          cy.contains('button', 'Run Bulk Delete').click();
        });

      cy.get('.bulk_granules--delete')
        .within(() => {
          cy.contains('button', 'Cancel Bulk Delete');
          cy.contains('button', 'Run Bulk Delete').click();
        });

      cy.wait('@postBulkDelete');
      cy.contains('p', asyncOperationId);
      cy.contains('button', 'Close');
      cy.contains('button', 'Go To Operations');
    });

    describe('handles error from failed bulk granule operations request', () => {
      const errorMessage = 'bulk operations failure';

      beforeEach(() => {
        cy.server();
        cy.route({
          method: 'POST',
          status: 400,
          url: '/granules/bulk',
          response: {
            message: errorMessage
          }
        }).as('postBulkGranules');

        cy.visit('/granules');
        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Operations').click();
          });

        cy.get('.bulk_granules--operations')
          .within(() => {
            cy.contains('button', 'Run Bulk Operations').click();
          });

        cy.wait('@postBulkGranules');
      });

      it('show error message', () => {
        cy.contains('.error__report', errorMessage);
      });

      it('hides error message when modal is closed and re-opened', () => {
        cy.contains('.error__report', errorMessage);
        cy.contains('button', 'Cancel Bulk Operations').click();

        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Operations').click();
          });

        cy.get('.error__report').should('not.exist');
      });
    });

    describe('handles error from failed bulk granule delete request', () => {
      const errorMessage = 'bulk delete failure';

      beforeEach(() => {
        cy.server();
        cy.route({
          method: 'POST',
          status: 400,
          url: '/granules/bulkDelete',
          response: {
            message: errorMessage
          }
        }).as('postBulkDelete');

        cy.visit('/granules');
        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Delete').click();
          });

        cy.get('.bulk_granules--delete')
          .within(() => {
            cy.contains('button', 'Run Bulk Delete').click();
          });

        cy.wait('@postBulkDelete');
      });

      it('show error message', () => {
        cy.contains('.error__report', errorMessage);
      });

      it('hides error message when modal is closed and re-opened', () => {
        cy.contains('.error__report', errorMessage);
        cy.contains('button', 'Cancel Bulk Delete').click();

        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Delete').click();
          });

        cy.get('.error__report').should('not.exist');
      });
    });
  });
});
