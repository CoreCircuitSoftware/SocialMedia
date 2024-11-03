// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// const username = "123"
// const password = "123"
const key = "CS4800"

Cypress.Commands.add('login', (username, password) => {
    cy.session('user', () => {
        cy.visit('/login')
        cy.get('[data-cy="username"]').type(username)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="key"]').type(key)
        cy.get('[data-cy="login"]').click()
        cy.url().should('include', '/profile');
    })
})