export const LoginPage = {
    getUsername(){
        return cy.get('[data-test=username]')
    },
    getPassword() {
        return cy.get('[data-test=password]')
    },
    getLoginButton() {
        return cy.get('[data-test=login-button]')
    },
    getError() {
        return cy.get('[data-test=error]')
    },
    login(username, password) {
        cy.session('user session', () => {
            cy.log('** login **')
            cy.visit('/')
            LoginPage.getUsername()
                .should('be.visible')
                .and('have.attr', 'placeholder', 'Username')
                .type(username);
            LoginPage.getPassword()
                .should('be.visible')
                .and('have.attr', 'placeholder', 'Password')
                .type(password, { log: false})
            LoginPage.getLoginButton()
                .should('be.visible')
                .click()
            cy.location('pathname')
                .should('equal', '/inventory.html')
        })
        cy.visit('/inventory.html')
    },
    noErrors(){
        cy.log('** check that there are no errors **')
        LoginPage.getUsername()
        .should('not.have.class', 'error')
        .and('be.visible')
      LoginPage.getPassword()
        .should('not.have.class', 'error')
        .and('be.visible')
      LoginPage.getError().should('not.exist')
    },
    hasErrors(errorMsg){
        cy.log('** check that there are errors **')
        LoginPage.getError()
        .should('be.visible')
        .and('have.text', errorMsg)
        .find('.error-button')
        .should('be.visible')
        .click();
    }
}