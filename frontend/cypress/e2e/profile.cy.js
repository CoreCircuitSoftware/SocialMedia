const username = "123"
const password = "123"
const key = "CS4800"

Cypress.Commands.add('login', () => {
    cy.session('user', () => {
        cy.visit('/login')
        cy.get('[data-cy="username"]').type(username)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="key"]').type(key)
        cy.get('[data-cy="login"]').click()
        cy.url().should('include', '/profile');
    })
})

describe('profile page buttons', () => {
    beforeEach(() => {
        cy.login();
    });

    it('user presses the profile button from the profile page to bring them to their user page', () => {      
      cy.visit('/')
      cy.url().should('include', '/profile/' + username)
      cy.get('[data-cy="profile"]').click()
      cy.url().should('include', '/profile/' + username)
    })

    it('user presses the home button from the profile page to go to the home feed', () => {      
        cy.visit('/')
        cy.url().should('include', '/profile/' + username)
        cy.get('[data-cy="home"]').click()
        cy.url().should('include', '/home')
      })
})