export const LoginPage = {
    selectors: {
        username: '[data-test=username]',
        password: '[data-test=password]',
        form: '.login-box > form',
        error: '[data-test=error]',
        loginButton: '[data-test=login-button]'
    },
    fillLoginForm(username: string, password: string) {
        cy.get(this.selectors.form)
            .fillForm({
                [this.selectors.username]: username,
                [this.selectors.password]: password,
            })
            .submit();
    },
    login(username: string, password: string) {
        cy.session(
            "user session",
            () => {
                cy.log("** login **");
                cy.visit("/");
                this.fillLoginForm(username, password)
                cy.location("pathname").should("equal", "/inventory.html");
            },
            {
                validate() {
                    cy.log("**validate login session**");
                    cy.getCookie("session-username").then((cookie) => {
                        if (!cookie) {
                            return false;
                        }
                    });
                    //Here are two other options to do the same valiation

                    //1. casting null to false
                    //cy.getCookie('session-username').then(Boolean)

                    //2. using asseration
                    //cy.getCookie('session-username').should('exist')
                },
            }
        );
        cy.visit("/inventory.html");
        cy.location("pathname").should("equal", "/inventory.html");
    },
    noErrors() {
        cy.log("** check that there are no errors **");
        cy.get(this.selectors.username)
            .should("not.have.class", "error")
            .and("be.visible");
        cy.get(this.selectors.password)
            .should("not.have.class", "error")
            .and("be.visible");
        cy.get(this.selectors.error).should("not.exist");
    },
    hasErrors(errorMsg: string) {
        cy.log("** check that there are errors **");
        cy.get(this.selectors.error)
            .should("be.visible")
            .and("have.text", errorMsg)
            .find(".error-button")
            .should("be.visible")
            .click();
    },
} as const;
