import { LoginPage } from '../pages/login.page'
import { InventoryPage } from '../pages/inventory.page'
import { CartPage } from '../pages/cart.page'
import StanardUserInventoryList from '../fixtures/standardUserInventoryList.json'

/**
 * create a small type on the fly using jsdoc comment
 * just to help type check help us
 */
interface LoginInfo {
  username: string
  password: string
}

describe('Cart', () => {
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

  it.only('should show the added items in order they were added',
    { viewportHeight: 1200 },
    () => {
      // add each item to cart using the InventoryPage object
      cy.log('**added all items to cart**')
      StanardUserInventoryList.forEach(item => {
        InventoryPage.addItemToCart(item.name)
      })
      // confirm the cart badge shows the right number of items
      // then click on it
      // https://on.cypress.io/click
      InventoryPage.getInventoryItemRemoveButtons().should('have.length', StanardUserInventoryList.length)
      InventoryPage.getShoppingCartBadge()
        .should('have.text', StanardUserInventoryList.length)
        .scrollIntoView()
        .and('be.visible')
        .click()

      
      // confirm we move to the cart page
      // https://on.cypress.io/location
      cy.location('pathname').should('equal', '/cart.html')

      //
      // confirm the cart items list has the right number of elements
      CartPage.getCartItems()
        .should('have.length', StanardUserInventoryList.length)
        .as('cartItems')
      cy.log('**shows each item in order**')
      // iterate over the items
      // confirm each itm is at the right place
      // on the page in the list of items
      // https://on.cypress.io/get
      // https://on.cypress.io/eq
      // and confirm that within the item the name
      // is correct and the quantity is 1
      StanardUserInventoryList.forEach((item, i) => {
        cy.get('@cartItems')
          .eq(i)
          .within(() => {
            cy.contains('.cart_quantity', 1)
            cy.contains('.inventory_item_name', item.name)
          })
      })

    //check the ids in local storage
    let idList: number[] = []

    StanardUserInventoryList.forEach((item) => {
      idList.push(item.id)
    })

    cy.window()
    .its('localStorage')
    .invoke('getItem', 'cart-contents')
    .should('exist')
    //@ts-ignore
    .then(JSON.parse)
    .should('deep.equal', idList)
    .and('have.length', StanardUserInventoryList.length)
  })

  it('removes items from cart', { viewportHeight: 1200 }, () => {
    // using the inventory page object
    // add 'Sauce Labs Bike Light' and 'Sauce Labs Bolt T-Shirt' items
    const items = 
    [
      'Sauce Labs Bike Light', 
      'Sauce Labs Bolt T-Shirt'
    ]

    items.forEach((item) => {
      InventoryPage.addItemToCart(item)
    })
  
    //
    // the cart icon should show badge with number 2
    InventoryPage.getInventoryItemRemoveButtons().should('have.length', items.length)
    InventoryPage.getShoppingCartBadge()
      .should('have.text', items.length)
      .scrollIntoView()
      .and('be.visible')
      .click()

    // and once you click it, you should transition to the cart page
    cy.log('**we are on the cart page**')
    cy.location('pathname').should('equal', '/cart.html')

    // there should 2 items in the cart
    CartPage.getCartItems().should('have.length', items.length)

    cy.log('**remove the Bike Light**')
    // find the cart item with text "Bike Light"
    // and click the Remove button

    cy.contains('.cart_item', items[0])
      .find('[data-test^=remove-]')
      .should('be.visible')
      .click()

    cy.log('**the T-shirt item still remains**')
    CartPage.getCartItems()
      .should('have.length', 1)
      .contains(items[1])
    // there should be a single cart item
    // and it should have text "Bolt T-Shirt"
    // the cart badge should show number 1
    InventoryPage.getShoppingCartBadge()
      .should('have.text', 1)

    //check local storage
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'cart-contents')
      .should('exist')
      //cart-contents is stingified JSON
      //@ts-ignore
      .then(JSON.parse)
      .should('deep.equal', [1])
      .and('have.length', 1)
  })
})