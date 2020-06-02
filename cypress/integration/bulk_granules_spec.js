describe('Dashboard Granules Page', () => {
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
          cy.contains('button', 'Run Bulk Deletion');
          cy.contains('button', 'Run Bulk Operations');
        });
    });
  });
});
