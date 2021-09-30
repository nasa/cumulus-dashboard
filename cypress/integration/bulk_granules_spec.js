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
      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Run Bulk Granules').click();

      cy.get('.bulk_granules')
        .within(() => {
          cy.contains('button', 'Run Bulk Delete');
          cy.contains('button', 'Run Bulk Operations');
          cy.contains('button', 'Run Bulk Reingest');
          cy.contains('button', 'Run Bulk Recovery');
        });
    });

    it('handles a successful bulk granule operation request', () => {
      const asyncOperationId = Math.random().toString(36).substring(2, 15);

      cy.intercept('POST', '/granules/bulk', { id: asyncOperationId }).as('postBulkGranules');

      cy.visit('/granules');
      cy.contains('button', 'Granule Actions').click();
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

    it('appends correct query params after bulk granule operation request', () => {
      const asyncOperationId = Math.random().toString(36).substring(2, 15);

      cy.intercept('POST', '/granules/bulk', {
        id: asyncOperationId
      }).as('postBulkGranules');

      cy.visit('/granules');
      cy.setDatepickerDropdown('Recent');
      cy.url().should('include', 'startDateTime');
      cy.contains('button', 'Granule Actions').click();
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
      cy.contains('button', 'Go To Operations').click();
      cy.url().should('include', 'startDateTime');
    });

    it('handles successful bulk granule deletion request', () => {
      const asyncOperationId = Math.random().toString(36).substring(2, 15);

      cy.intercept('POST', '/granules/bulkDelete', {
        id: asyncOperationId
      }).as('postBulkDelete');

      cy.visit('/granules');
      cy.contains('button', 'Granule Actions').click();
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

    it('handles successful bulk granule reingest request', () => {
      const asyncOperationId = Math.random().toString(36).substring(2, 15);
      const granuleIds = ['MOD09GQ.A9344328.K9yI3O.006.4625818663028', 'MOD09GQ.A2417309.YZ9tCV.006.4640974889044'];

      cy.intercept('POST', '/granules/bulkReingest', {
        id: asyncOperationId
      }).as('postBulkReingest');

      cy.visit('/granules');
      cy.get(`[data-value="${granuleIds[0]}"] > .td >input[type="checkbox"]`).click();
      cy.get(`[data-value="${granuleIds[1]}"] > .td >input[type="checkbox"]`).click();

      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Run Bulk Granules').click();

      cy.get('.bulk_granules')
        .within(() => {
          cy.contains('button', 'Run Bulk Reingest').click();
        });

      cy.get('.bulk_granules--reingest')
        .within(() => {
          cy.get('.form__dropdown .dropdown__element input').as('workflow-input');
          cy.get('@workflow-input').click({ force: true }).type('IngestAndPublish', { force: true }).type('{enter}');
          cy.get('.form__dropdown .dropdown__element').should('have.text', 'IngestAndPublishGranule');
          cy.contains('button', 'Cancel Bulk Reingest');
          cy.contains('button', 'Run Bulk Reingest').click();
        });

      cy.wait('@postBulkReingest');
      cy.contains('p', asyncOperationId);
      cy.contains('button', 'Close');
      cy.contains('button', 'Go To Operations');
    });

    it('handles a successful bulk granule recovery request', () => {
      const asyncOperationId = Math.random().toString(36).substring(2, 15);

      cy.intercept('POST', '/granules/bulk', { id: asyncOperationId }).as('postBulkRecovery');

      cy.visit('/granules');
      cy.contains('button', 'Granule Actions').click();
      cy.contains('button', 'Run Bulk Granules').click();

      cy.get('.bulk_granules')
        .within(() => {
          cy.contains('button', 'Run Bulk Recovery').click();
        });

      cy.get('.bulk_granules--recovery')
        .within(() => {
          cy.contains('button', 'Cancel Bulk Recovery');
          cy.contains('button', 'Run Bulk Recovery').click();
        });

      cy.wait('@postBulkRecovery');
      cy.contains('p', asyncOperationId);
      cy.contains('button', 'Go To Operations');
    });

    describe('handles error from failed bulk granule operations request', () => {
      const errorMessage = 'bulk operations failure';

      beforeEach(() => {
        cy.intercept(
          { method: 'POST', url: '/granules/bulk' },
          { statusCode: 400, body: { message: errorMessage } }
        ).as('postBulkGranules');

        cy.visit('/granules');
        cy.contains('button', 'Granule Actions').click();
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
        cy.intercept(
          { method: 'POST', url: '/granules/bulkDelete' },
          { statusCode: 400, body: { message: errorMessage } }
        ).as('postBulkDelete');

        cy.visit('/granules');
        cy.contains('button', 'Granule Actions').click();
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

    describe('handles error from failed bulk granule reingest request', () => {
      const errorMessage = 'bulk reingest failure';

      beforeEach(() => {
        cy.intercept(
          { method: 'POST', url: '/granules/bulkReingest' },
          { statusCode: 400, body: { message: errorMessage } }
        ).as('postBulkReingest');

        cy.visit('/granules');
        cy.contains('button', 'Granule Actions').click();
        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Reingest').click();
          });

        cy.get('.bulk_granules--reingest')
          .within(() => {
            cy.contains('button', 'Run Bulk Reingest').click();
          });

        cy.wait('@postBulkReingest');
      });

      it('show error message', () => {
        cy.contains('.error__report', errorMessage);
      });

      it('hides error message when modal is closed and re-opened', () => {
        cy.contains('.error__report', errorMessage);
        cy.contains('button', 'Cancel Bulk Reingest').click();

        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Reingest').click();
          });

        cy.get('.error__report').should('not.exist');
      });
    });

    describe('handles error from failed bulk granule recovery request', () => {
      const errorMessage = 'bulk recovery failure';

      beforeEach(() => {
        cy.intercept(
          { method: 'POST', url: '/granules/bulk' },
          { statusCode: 400, body: { message: errorMessage } }
        ).as('postBulkRecovery');

        cy.visit('/granules');
        cy.contains('button', 'Granule Actions').click();
        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Recovery').click();
          });

        cy.get('.bulk_granules--recovery')
          .within(() => {
            cy.contains('button', 'Run Bulk Recovery').click();
          });

        cy.wait('@postBulkRecovery');
      });

      it('shows error message', () => {
        cy.contains('.error__report', errorMessage);
      });

      it('hides error message when modal is closed and re-opened', () => {
        cy.contains('.error__report', errorMessage);
        cy.contains('button', 'Cancel Bulk Recovery').click();

        cy.contains('button', 'Run Bulk Granules').click();

        cy.get('.bulk_granules')
          .within(() => {
            cy.contains('button', 'Run Bulk Recovery').click();
          });

        cy.get('.error__report').should('not.exist');
      });
    });
  });
});
