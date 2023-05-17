import { LoginPage } from '../support/pages/login.page'
import { CartPage } from '../support/pages/cart.page'
import { CheckoutPage } from '../support/pages/checkout.page'
import { InventoryData } from '../../src/utils/InventoryData'

describe('Checkout', () => {
  interface LoginInfo{
    username: string
    password: string
  }

  const user: LoginInfo = Cypress.env('users').standard
  // we can even check if the user object is valid
  if (!user) {
    throw new Error('Missing the standard user')
  }

  // before each test, quickly login the user
  // or restore the previous user session
  beforeEach(() => {
    LoginPage.login(user.username, user.password)
  })

  it('goes through the check out pages', { viewportHeight: 1200 }, () => {
    // grab the "id" property from each item in the InventoryData array
    // Tip: I told you Lodash is a super neat library
    const ids = Cypress._.map(InventoryData, 'id')
    console.log(ids)
    // set the ids in the local storage item "cart-contents"
    // Tip: local storage usually has stringified data
    //
    // cy.window()
    //   .its('localStorage')
    //   .invoke('setItem', 'cart-contents', JSON.stringify(ids))
    //
    window.localStorage.setItem('cart-contents', JSON.stringify(ids))
    //
    // visit the cart page
    // https://on.cypress.io/visit
    cy.visit('/cart.html')
    //
    // confirm each item name is present
    // confirm the cart items list has the right number of elements
    CartPage
      .getCartItems()
      .should('have.length', InventoryData.length)
      .each(($el, index) => {
        cy.contains('.inventory_item_name', InventoryData[index].name)
          .should('be.visible')
      })
    //
    // click on the Checkout button
    cy.contains('[data-test=checkout]', 'Checkout')
      .scrollIntoView()
      .should('be.visible')
      .click()
    //
    // we should be on the checkout step one page
    // https://on.cypress.io/location
    cy.location('pathname').should('equal', '/checkout-step-one.html')
    //
    // fill the check out form with values "Joe Smith 90210"
    // and click the "Continue" element after confirming
    // the "Continue" element has the right "value" attribute
    // https://on.cypress.io/within
    CheckoutPage.fillInformationForm().submit()
    //
    // we should be on the checkout step two page
    cy.location('pathname').should('equal', '/checkout-step-two.html')
    //
    // the summary page shows the expected number of cart items
    CartPage.getCartItems().should('have.length', InventoryData.length)
    //
    // find the "Finish" button and click on it
    // https://on.cypress.io/contains
    // tip: I like using cy.contains with selector and text
    // to avoid accidental text match and confirm the button's caption text
    cy.contains('[data-test=finish]', 'Finish')
      .scrollIntoView()
      .click()
    //
    // we should be on the checkout complete page
    cy.location('pathname').should('eq', '/checkout-complete.html')
    //
    // it shows the checkout complete component
    cy.get('#checkout_complete_container').should('be.visible')
    //
    // the application should have cleared the local storage item "cart-contents"
    // tip: the item you get from local storage should not exist
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'cart-contents')
      .should('not.exist')
  })
})