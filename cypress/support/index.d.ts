declare namespace Cypress {
    interface Chainable<Subject = any> {
      fillForm(inputs): Chainable<JQuery<HTMLFormElement>>
      getByTest(testId): ChainableChainable<JQuery<HTMLElement>>
      containsByTest(testId, text): ChainableChainable<JQuery<HTMLElement>>
    }
  }