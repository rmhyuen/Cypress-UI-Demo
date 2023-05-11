export const InventoryPage = {
    getProductSortContainer(){
        return cy.get('[data-test=product_sort_container]')
    },
    getInventoryItemPrice(){
        return cy.get('.inventory_item_price')
    },
    getInventoryItemName(){
      return cy.get('.inventory_item_name')  
    },
    /**
     * 
     * @param {'a-z', 'z-a', 'lohi', 'hilo'} order 
     */
    sortBy(order){
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
    }
}