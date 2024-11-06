const username = "123"
const password = "123"
const key = "CS4800"

const uniqueSeed = Date.now().toString();
const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);

describe('message page', () => {
    beforeEach(() => {
        cy.login(username, password);
      });

    
      it('user tries to message user that they haven\'t messaged before', () => {    //user here is "messgetestuser"   
        cy.visit('/profile/messgetestuser/message/')
        cy.url().should('include', '/messgetestuser/message/')
        cy.get('[data-cy="no-msg-user-before"]').should('exist')
      })

      it('user types message and presses send', () => {    //user here is "messagetestuser"
        const uniqueMSG = getUniqueId();

        cy.visit('/profile/messagetestuser/message/')
        cy.url().should('include', '/messagetestuser/message/')
        cy.get('[data-cy="message-form"]').should('exist')
        cy.get('[data-cy="message-input"]').should('exist').type('test-msg-' + uniqueMSG)
        cy.get('[data-cy="send-message"]').should('exist').click()
        cy.reload()
        cy.get('[data-cy="message-display"]').last().should('exist')
        cy.get('[data-cy="message-display"]').last().should('contain','test-msg-' + uniqueMSG)
      })

    //   it('user visits site, logs in with already created credentials', () => {
    //     cy.visit('/')
    //     cy.get('[data-cy="username"]').type('123')
    //     cy.get('[data-cy="password"]').type('123')
    //     cy.get('[data-cy="key"]').type('CS4800')
    //     cy.get('[data-cy="login"]').click()
    //     cy.url().should('include', '/profile');
    //   })
})