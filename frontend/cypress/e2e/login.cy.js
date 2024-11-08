describe('login page', () => {
  it('user visits site for first time (aka: not logged in)', () => {
    cy.visit('/')
    cy.url().should('include', '/login');
  })

  it('user visits site, goes to register page using register button', () => {
    cy.visit('/')
    cy.get('[data-cy="register"]').click()
    cy.url().should('include', '/register');
  })

  it('user visits site, logs in with already created credentials', () => {
    cy.visit('/')
    cy.get('[data-cy="username"]').type('123')
    cy.get('[data-cy="password"]').type('123')
    cy.get('[data-cy="key"]').type('CS4800')
    cy.get('[data-cy="login"]').click()
    cy.url().should('include', '/profile');
  })
})