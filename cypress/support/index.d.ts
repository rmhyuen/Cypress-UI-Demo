declare namespace Cypress {
    interface Chainable<Subject = any> {
      fillForm(firstName: string = 'Joe', lastName: string = 'Smith', postalCode: string = '90210'): Chainable<any>;
    }
  }