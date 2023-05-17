export const CartPage = {
    getCheckoutButton(){
        return cy.getByTest('checkout')
    },
    getCartItems(){
        return cy.get('.cart_item')
    }
}