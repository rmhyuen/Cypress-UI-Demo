import { LoginPage } from '../support/pages/login.page'
import { InventoryData } from '../../src/utils/InventoryData'
import { CheckoutPage } from '../support/pages/checkout.page'

describe('Checkout', () => {
  interface LoginInfo{
    username: string,
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

  it('shows the tax within limits', { viewportHeight: 1200 }, () => {
    // pick random 3 items from the InventoryData array
    // https://lodash.com/docs
    // Tip: I told you Lodash is a super neat library
    const pickedItems = Cypress._.sampleSize(InventoryData, 3)
    // grab the "id" property from each item in the picked items
    // Tip: I told you Lodash is a super neat library
    const ids = Cypress._.map(pickedItems, 'id')
    // set the ids in the local storage item "cart-contents"
    // Tip: local storage usually has stringified data
    window.localStorage.setItem('cart-contents', JSON.stringify(ids))

    // visit the page checkout-step-one.html directly
    // skipping the inventory page
    // https://on.cypress.io/visit
    cy.visit('/checkout-step-one.html')

    // fill the check out form with values "Joe Smith 90210"
    // and click the "Continue" element after confirming
    // the "Continue" element has the right "value" attribute
    // https://on.cypress.io/within
    CheckoutPage.fillInformationForm().submit()
    // we should be on the checkout step two page
    // https://on.cypress.io/location
    cy.location('pathname').should('equal', '/checkout-step-two.html')
    // the overview page shows the expected number of picked items
    cy.get('.cart_list .cart_item').should('have.length', pickedItems.length)

    // grab the "price" property from each picked item
    // using Lodash method _.map
    const prices = Cypress._.map(pickedItems, 'price')
    // and sum the prices to compute the expected total price
    // using Lodash method _.sum
    const sum = Cypress._.sum(prices)
    // print the picked prices and the computed sum
    // to the Command Log for clarity
    cy.log(prices.join(' + ') + ' = ' + sum)
    // calculate min and max reasonable tax: 5% and 10% of the order
    // note: we don't have to round the numbers
    // since we will use them in numerical assertion
    //
    // print the min and max tax to Command Log
    const minTax = sum * .05
    cy.log('Min Tax: ' + minTax)
    const maxTax = sum * .10
    cy.log('Max Tax: ' + maxTax)
    //
    // confirm the page shows the tax and the text $...X.YZ
    // can be converted into a number
    // and is between min and max tax amounts
    // Hint: https://glebbahmutov.com/cypress-examples/recipes/dollar-range.html
    //
    // grab the element's text
    // match the text using a regular expression with a named capture group "tax"
    // from the regular expression match get its "groups" property
    // get the "tax" property, it should be a string
    // convert the text to a number
    // https://on.cypress.io/then
    // and confirm the number is between min and max tax numbers
    // https://glebbahmutov.com/cypress-examples/commands/assertions.html
    cy.contains('.summary_tax_label', /Tax: \$\d+.\d{2}/)
      .should('be.visible')
      .invoke('text')
      .then(console.log)
      .invoke('match', /\$(?<tax>\d+.\d{2})/)
      .then(console.log)
      .its('groups.tax')
      .then(console.log)
      .then(Number)
      .then(console.log)
      .should('be.within', minTax, maxTax)
  })
})