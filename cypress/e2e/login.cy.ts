import { LoginPage } from '../pages/login.page'

/** @type {{username: string, password: string}} */
const standard = Cypress.env('users').standard
if(!standard) {
  throw new Error('Missing the standard user')
}

/** @type {{username: string, password: string}} */
const lockedOut = Cypress.env('users').lockedOut
if(!lockedOut) {
  throw new Error('Missing the lockedOut user')
}

describe('Swag Labs', () => {
  context('Login', () => {
    it('should validate standard user', () => {
      LoginPage.login(standard.username, standard.password)
    })

    it('should validate locked out user', () => {
      cy.visit('/')
      LoginPage.noErrors()
      LoginPage.getUsername()
          .should('be.visible')
          .and('have.attr', 'placeholder', 'Username')
          .type(lockedOut.username);
      LoginPage.getPassword()
          .should('be.visible')
          .and('have.attr', 'placeholder', 'Password')
          .type(lockedOut.password, { log: false})
      LoginPage.getLoginButton()
          .should('be.visible')
          .click()
      cy.location('pathname').should('equal', '/')

      LoginPage.hasErrors('Epic sadface: Sorry, this user has been locked out.')
      LoginPage.noErrors()
    })

    it('should not allow anonymous users to directly access the inventory page', () => {
      cy.visit('/inventory.html')
      cy.location('pathname').should('equal', '/')
      LoginPage.hasErrors("Epic sadface: You can only access '/inventory.html' when you are logged in.")
      LoginPage.noErrors()
    })

    it('should not allow empty username', () => {
      cy.visit('/')
      LoginPage.getLoginButton()
        .should('be.visible')
        .click()
      LoginPage.hasErrors('Epic sadface: Username is required')
      LoginPage.noErrors()
    })

    it('should not allow empty password', () => {
      cy.visit('/')
      LoginPage.getUsername().type('username')
      LoginPage.getLoginButton()
        .should('be.visible')
        .click()
      LoginPage.hasErrors('Epic sadface: Password is required')
      LoginPage.noErrors()
    })
  })
})