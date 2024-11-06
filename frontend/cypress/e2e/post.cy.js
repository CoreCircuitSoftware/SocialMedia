const username = "123"
const password = "123"

const uniqueSeed = Date.now().toString();
const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);

describe('post page', () => {
    beforeEach(() => {
        cy.login(username, password);
      });

      it('user tries to make post without a title', () => {
        cy.visit('/post/create/')
        cy.url().should('include', '/post/create/')
        cy.get('[data-cy="post-title"]').should('exist')
        cy.get('[data-cy="post-description"]').should('exist').type("test-input")
        cy.get('[data-cy="submit-post"]').should('exist').click()
        cy.get('[data-cy="title-error"]').should('contain', 'Error: Title required for post')
      })

      it('user tries to make post without a title and description', () => {
        cy.visit('/post/create/')
        cy.url().should('include', '/post/create/')
        cy.get('[data-cy="post-title"]').should('exist')
        cy.get('[data-cy="post-description"]').should('exist')
        cy.get('[data-cy="submit-post"]').should('exist').click()
        cy.get('[data-cy="title-error"]').should('contain', 'Error: Title required for post')
      })

      it('user tries to make post without a title and description', () => {
        cy.visit('/post/create/')
        cy.url().should('include', '/post/create/')
        cy.get('[data-cy="go-back"]').should('exist').click()
        cy.url().should('include', '/profile/')
      })
})