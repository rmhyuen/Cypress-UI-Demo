export const InventoryPage = {
    getProductSortContainer(){
        return cy.getByTest('product_sort_container')
    },
    getInventoryItemPrice(){
        return cy.get('.inventory_item_price')
    },
    getInventoryItemName(){
      return cy.get('.inventory_item_name')  
    },
    getShoppingCartLink(){
        return cy.get('.shopping_cart_link')
    },
    getShoppingCartBadge(){
        return InventoryPage.getShoppingCartLink().find('.shopping_cart_badge')
    },
    getInventoryItemRemoveButtons(){
        return cy.get('.inventory_item:contains("Remove")')
    },
    /**
     * 
     * @param {'a-z', 'z-a', 'lohi', 'hilo'} order 
     */
    sortBy(order: string){
        expect(order, 'sort order').to.be.oneOf(['az', 'za', 'lohi', 'hilo'])
        cy.log(`** sort by ${order} **`)
        return InventoryPage.getProductSortContainer()
            .should('be.visible')
            .select(order)
    },
    getPrices(){
        cy.log('** get prices **')
        return InventoryPage.getInventoryItemPrice()
            .should('be.visible')
            .map('innerText')
            .mapInvoke('slice', 1)
            .map(Number)
            .print('prices %o')
    },
    getNames(){
        cy.log('** get names **')
        return InventoryPage.getInventoryItemName()
            .should('be.visible')
            .map('innerText')
            .print('names %o')
    },
    addItemToCart(inventoryItemName: string){
        cy.log(`** add "${inventoryItemName}" to cart **`)
        return cy.contains('.inventory_item', inventoryItemName)
        .within(() => {
          cy.contains('button', 'Add to cart')
            .as('addToCart')
            .click()
          cy.get('@addToCart').should('not.exist')
          cy.contains('button', 'Remove')
            .should('be.visible')
        })
    }
}