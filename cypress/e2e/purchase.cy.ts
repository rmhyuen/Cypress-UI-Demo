import { LoginPage } from '@support/pages/login.page'
import { InventoryPage } from '@support/pages/inventory.page'
import { InventoryData } from '../../src/utils/InventoryData'
import { CheckoutPage } from '@support/pages/checkout.page'
import { CartPage } from '@support/pages/cart.page'

// for each user object, create its own test
// - login
// - add 1 item to the cart
// - confirm the total price
// - check out

// 📺 Watch the video Dynamic Tests From Cypress.io Fixture File

// 📝 Read the blog post Refactor Tests To Be Independent And Fast Using Cypress-Each Plugin

describe('', () => {
    interface LoginInfo {
        username: string,
        password: string
    }

    const users = Cypress.env('users')
    const item = Cypress._.sample(InventoryData)

    Cypress._.each(users, (user: LoginInfo, name) => {
        it(`should work for user persona ${name}`, () => {
            LoginPage.login(user.username, user.password)
            InventoryPage.addItemToCart(item!.name)
            InventoryPage.getShoppingCartLink().click()
            cy.location('pathname').should('eq', '/cart.html')
            CartPage.getCheckoutButton().click()
            cy.location('pathname').should('eq', '/checkout-step-one.html')
            CheckoutPage.fillInformationForm().submit()
            cy.location('pathname').should('eq', '/checkout-step-two.html')
            cy.contains('.summary_subtotal_label', item!.price)
            CheckoutPage.getFinishButton().click()
            cy.location('pathname').should('eq', '/checkout-complete.html')
        })
    })

})