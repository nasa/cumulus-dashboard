// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface EditJsonOptions {
      data: object
      update?: false
    }

    interface Chainable {
      /**
       * Edit the contents of a JSON textarea
       *
       * @param {EditJsonOptions} options
       * @param {Object} options.data - Data to set
       * @param {boolean} [options.update=false]
       *   Should data be treated as an update (`true`) or overwrite (`false`). Defaults to `false`.
       *
       * @memberof Chainable
       * @example
       ```
       // Replace object in textarea
       cy.editJsonTextarea({
         data: { foo: "bar" }
       })

       // Update object: "foo" will be added/overwritten to "bar"
       cy.editJsonTextarea({
         data: { foo: "bar" },
         update: true
       })
       ```
       */
      editJsonTextarea(options: EditJsonOptions): Chainable<null>

      /**
       * Login to dashboard via network requests
       *
       * To ensure the user is logged in across all tests in the spec,
       * use `cy.login()` in `beforeEach()`
       *
       * @memberof Chainable
       * @example
       *    cy.login()
       */
      login(): Chainable<null>
    }
  }
}

export {}
