declare namespace Cypress {
    interface Chainable<Subject = any> {
      fillForm(inputs): Chainable<any>;
    }
  }