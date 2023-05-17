// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
  'fillForm',
  { prevSubject: 'element' },
  ($form, inputs) => {
    cy.wrap($form, { log: false }).within(() => {
      Cypress._.forEach(inputs, (value, selector) => {
        cy.get(selector.toString())
          .should('be.visible')
          .type(value)
      })
    })
  }
)

Cypress.Commands.add('getByTest', (testId: string) => {
  return cy.get(`[data-test=${testId}]`)
})

Cypress.Commands.add('containsByTest', (testId: string, text: string = '') => {
  return cy.contains(`[data-test=${testId}]`, text)
})