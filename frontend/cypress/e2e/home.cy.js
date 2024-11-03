const username = "123"
const password = "123"
const key = "CS4800"

describe('home page buttons', () => {
    beforeEach(() => {
        cy.login();
    });

    it('user clicks a profile picture and navigates to that users profile page', () => {
        cy.visit('/home')
        cy.get('[data-cy="profile-picture"]').first().click()
        cy.url().should('include', '/profile/')
    })

    // beforeEach(() => {
    //     cy.login();
    // });

    // it('user presses the profile button from the profile page to bring them to their user page', () => {
    //     cy.visit('/')
    //     cy.url().should('include', '/profile/' + username)
    //     cy.get('[data-cy="profile"]').click()
    //     cy.url().should('include', '/profile/' + username)
    // })

    // it('user presses the home button from the profile page to go to the home feed', () => {
    //     cy.visit('/')
    //     cy.url().should('include', '/profile/' + username)
    //     cy.get('[data-cy="home"]').click()
    //     cy.url().should('include', '/home')
    // })
})