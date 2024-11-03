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

  it('User clicks edit on their profile page, bringing them to the edit profile page', () => {
    cy.visit('/profile')
    cy.get('[data-cy="edit"]').click()
    cy.url().should('include', '/profile/edit')
  })

  it('user presses the logout button to log out of their account', () => {
    cy.visit('/')
    cy.url().should('include', '/profile/' + username)
    cy.get('[data-cy="logout"]').click()
    cy.url().should('include', '/login')
  })

  it('user presses the share button on their profile to copy a link to their profile to their clipboard', () => {
    cy.visit('/')


    cy.wait(500)
    cy.get('[data-cy="share"]').click()

    cy.assertValueCopiedToClipboard('http://circuitsocial.tech/profile/' + username)
  })
  Cypress.Commands.add('assertValueCopiedToClipboard', value => { // Used to access clipboard to verify copy
    cy.window().then(win => {
      win.navigator.clipboard.readText().then(text => {
        expect(text).to.eq(value)
      })
    })
  })

})

describe('general navigation', () => {
  beforeEach(() => {
    cy.login();
  });

  it('user navigates to a profile (testUser in this case) and is shown their page including username, displayname, number of friends, and posts (if any)', () => {
    cy.visit('/profile/testUser')
    cy.url().should('include', '/profile/testUser')
    cy.get('[data-cy="username"]').should('exist')
    cy.get('[data-cy="display-name"]').should('exist')
    cy.get('[data-cy="friends"]').should('exist')
    cy.get('[data-cy="posts"]').should('exist')
  })

  it('user clicks "Friends" to navigate to a list of the profiles friends', () => {
    cy.visit('/')
    cy.wait(500)
    cy.get('[data-cy="friends"]').click()
    cy.url().should('include', '/profile/' + username + '/friends')
  })
})