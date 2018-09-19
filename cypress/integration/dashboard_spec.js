
describe('Dashboard Tests', () => {
  it('When not logged in it should redirect to login page', () => {
    cy.visit('http://localhost:3000');
    cy.url().should('include', '/#/auth');
  });
});
