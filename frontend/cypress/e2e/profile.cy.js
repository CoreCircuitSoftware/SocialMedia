const username = "123"
const password = "123"
const key = "CS4800"

describe('profile page buttons', () => {
    beforeEach(() => {
      cy.login(username, password);
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
    //cy.assertValueCopiedToClipboard('http://circuitsocial.tech/profile/' + username)
    cy.assertValueCopiedToClipboard('http://127.0.0.1:8000/profile/' + username)
  })
  

    it('user presses the logout button to log out of their account', () => {
        cy.visit('/')
        cy.url().should('include', '/profile/' + username)
        cy.get('[data-cy="logout"]').click()
        cy.url().should('include', '/login')
    })

    it('user navigates to a profile, user\'s post is loaded', () => {
        cy.visit('/')
        cy.url().should('include', '/profile/' + username)
        cy.get('[data-cy="post-display"]').first().should('exist')
        cy.get('[data-cy="post-display"]').first().should('contain', username)
    })

    it('user navigates to a profile that contains no posts', () => { //needs to have user named "registertest2"
      cy.visit('/profile/registertest2/')
      cy.url().should('include', '/profile/registertest2/')
      cy.get('[data-cy="user-no-posts"]').should('exist')
  })
})

describe('search', () => {
  beforeEach(() => {
    cy.login(username, password);
  });

  it('user searches a query for usernames', () => { //query = 'test'
    cy.visit('/')
    cy.get('[data-cy="search-bar"]').should('exist')
    cy.get('[data-cy="search-input"]').should('exist').type('test')
    cy.get('[data-cy="search-button"]').should('exist').click()
    cy.url().should('include', '/search/')
    cy.get('[data-cy="search-user"]').each(($searchUser) => {
      cy.wrap($searchUser).should('contain', 'test')
    })
  })

  it('user searches for all users', () => { //query = 'test'
    cy.visit('/')
    cy.get('[data-cy="search-bar"]').should('exist')
    cy.get('[data-cy="search-button"]').should('exist').click()
    cy.url().should('include', '/search/')
    cy.get('[data-cy="search-all"]').should('contain', 'All Profiles')
    cy.get('[data-cy="search-user"]').each(($searchUser) => {
      cy.wrap($searchUser).should('exist')
    })
  })

  it('user searches for user with no matches', () => { //query = 'test'
    cy.visit('/')
    cy.get('[data-cy="search-bar"]').should('exist')
    cy.get('[data-cy="search-input"]').should('exist').type('jfasi398c89c2e0q9283mxwxcnfahcfacc381xashjmxaiufm')
    cy.get('[data-cy="search-button"]').should('exist').click()
    cy.url().should('include', '/search/')
    cy.get('[data-cy="no-results"]').should('contain', 'No Results found.')
    })
})

describe('general navigation', () => {
  beforeEach(() => {
    cy.login(username, password);
  });

  it('user navigates to a profile (testuser2 in this case) and is shown their page including username, displayname, number of friends, and posts (if any)', () => {
    cy.visit('/profile/testuser2')
    cy.url().should('include', '/profile/testuser2')
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
