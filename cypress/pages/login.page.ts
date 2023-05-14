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
    login(username: string, password: string) {
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
        }, 
        {
            validate() {
                cy.log('**validate login session**')
                cy.getCookie('session-username').then((cookie) => {
                    if(!cookie){
                        return false
                    }
                })
                //Here are two other options to do the same valiation
                
                //1. casting null to false
                //cy.getCookie('session-username').then(Boolean)
                
                //2. using asseration
                //cy.getCookie('session-username').should('exist')
              }
        }
        )
        cy.visit('/inventory.html')
        cy.location('pathname').should('equal', '/inventory.html')
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
    hasErrors(errorMsg: string){
        cy.log('** check that there are errors **')
        LoginPage.getError()
        .should('be.visible')
        .and('have.text', errorMsg)
        .find('.error-button')
        .should('be.visible')
        .click();
    }
}