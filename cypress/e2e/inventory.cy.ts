import 'cypress-map'
import { LoginPage } from '../pages/login.page'
import { InventoryPage } from '../pages/inventory.page'
import standardUserInventoryList from '../fixtures/standardUserInventoryList.json'

/** @type {{username: string, password: string}} */
const standard = Cypress.env('users').standard
if(!standard) {
  throw new Error('Missing the username')
}

describe('Swag Labs', { viewportHeight: 1200 }, () => {
  context('Inventory', () => {
    beforeEach(() => {
      LoginPage.login(standard.username, standard.password)
    })

    it('should have unique data item ids', () => {
      cy.get('.inventory_item')
        .invoke('toArray')
        .mapInvoke('getAttribute', 'data-itemid')
        .print('ids %o')
        .should(ids => {
          const unique = Cypress._.uniq(ids)
          expect(unique).to.deep.equal(ids)
        })
    })

    it('should validate all items in the standard user inventory list', () => {
      cy.get('.inventory_list').as('inventoryList')
      standardUserInventoryList.forEach((item) => {
        cy.get('@inventoryList').contains('.inventory_item', item.name).within(() => {
          cy.contains('.inventory_item_name', item.name)
          cy.contains('.inventory_item_desc', item.desc)
          cy.contains('.inventory_item_price', item.price)
        })
      })
    })

    it('should validate product sort by lowest price', () => {
      InventoryPage.sortBy('lohi')
      InventoryPage.getPrices()
        .should((prices) => {
          const sorted = Cypress._.sortBy(prices)
          expect(prices, 'sorted prices').to.deep.equal(sorted)
        })
    })

    it('should validate product sort by highest price', () => {
      InventoryPage.sortBy('hilo')
      InventoryPage.getPrices()
        .should((prices) => {
          const sorted = Cypress._.orderBy(prices, 'desc')
          expect(prices, 'sorted prices').to.deep.equal(sorted)
        })
    })

    it('should validate product sort by name, a-z', () => {
      InventoryPage.sortBy('az')
      InventoryPage.getNames()
        .should((names) => {
          const sorted = Cypress._.sortBy(names)
          expect(names, 'sorted names').to.deep.equal(sorted)
        })
    })

    it('should validate product sort by name, z-a', () => {
      InventoryPage.sortBy('za')
      InventoryPage.getNames()
        .should((names) => {
          const sorted = Cypress._.orderBy(names, 'desc')
          expect(names, 'sorted names').to.deep.equal(sorted)
        })
    })

    it('should add items to cart', () => {
      InventoryPage.getShoppingCartBadge()
        .should('not.exist')

      InventoryPage.addItemToCart('Sauce Labs Bike Light')
      
      InventoryPage.getShoppingCartBadge()
        .should('have.text', 1)
        .scrollIntoView()
        .and('be.visible')

      InventoryPage.addItemToCart('Sauce Labs Bolt T-Shirt')
      
      InventoryPage.getShoppingCartBadge()
        .should('have.text', 2)
        .scrollIntoView()
        .and('be.visible')

      InventoryPage.getInventoryItemRemoveButtons().should('have.length', 2)
    })
  })
})