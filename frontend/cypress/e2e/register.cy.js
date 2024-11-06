describe('login page', () => {
    it('user does not fill out every field (missing password in this case) and attempts to submit, is then notified that a field is missing', () => {
        cy.visit('/register')
        cy.get('[data-cy="username"]').type('333')
        //password is missing
        cy.get('[data-cy="email"]').type('robot@test.com')
        cy.get('[data-cy="display-name"]').type('333')
        cy.get('[data-cy="key"]').type('CS4800')
        cy.get('[data-cy="register"]').click()
        cy.url().should('include', '/register')
    })

    it('user does not input a valid email and attempts to submit, is then notified that email is invalid', () => {
        cy.visit('/register')
        cy.get('[data-cy="username"]').type('333')
        cy.get('[data-cy="password"]').type('123')
        cy.get('[data-cy="email"]').type('robot')   //invalid email
        cy.get('[data-cy="display-name"]').type('333')
        cy.get('[data-cy="key"]').type('CS4800')
        cy.get('[data-cy="register"]').click()
        cy.url().should('include', '/register')
    })

    it('user goes to login page by clicking on login button', () => {
        cy.visit('/register')
        cy.get('[data-cy="login"]').click()
        cy.url().should('include', '/login');
    })
})