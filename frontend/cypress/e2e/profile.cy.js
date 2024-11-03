const username = "123"
const password = "123"
const key = "CS4800"

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

    // it('user presses the ', () => {
    //     cy.visit('/')

    // })

    it('user presses the logout button to log out of their account', () => {
        cy.visit('/')
        cy.url().should('include', '/profile/' + username)
        cy.get('[data-cy="logout"]').click()
        cy.url().should('include', '/login')
    })
})