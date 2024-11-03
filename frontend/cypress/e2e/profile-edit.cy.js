const username = "123"
const password = "123"
const key = "CS4800"
const normDisplayName = "123"
const normBio = "bio"
const normPfp = "pfp"
const normBanner = "banner"

describe('editing different fields', () => {
    beforeEach(() => {
        cy.login();
    });
    afterEach(() => {
        cy.visit('/profile/edit')
        cy.get('[data-cy="bio"]').type(normBio)
        cy.get('[data-cy="display-name"]').type(normDisplayName)
        cy.get('[data-cy="confirm"]').click()
    });

    it('user changes their bio and clicks confirm to see updated bio in profile page', () => {
        cy.visit('/profile/edit')
        cy.get('[data-cy="bio"]').type("updated")
        cy.get('[data-cy="confirm"]').click()
        cy.url().should('include', '/profile/' + username)
        cy.get('[data-cy="bio"]').contains('updated')
    })

    it('user changes their displayName and clicks confirm to see updated displayName in profile page', () => {
        cy.visit('/profile/edit')
        cy.get('[data-cy="display-name"]').type("updated")
        cy.get('[data-cy="confirm"]').click()
        cy.url().should('include', '/profile/' + username)
        cy.get('[data-cy="display-name"]').contains('updated')
    })

    it('user changes anything and clicks cancel to see nothing is updated', () => {
        cy.visit('/profile/edit')
        cy.get('[data-cy="bio"]').type("updated")
        cy.get('[data-cy="display-name"]').type("updated")
        cy.get('[data-cy="cancel"]').click()
        cy.url().should('include', '/profile/' + username)
        cy.get('[data-cy="bio"]').contains(normBio)
        cy.get('[data-cy="display-name"]').contains(normDisplayName)
    })
})