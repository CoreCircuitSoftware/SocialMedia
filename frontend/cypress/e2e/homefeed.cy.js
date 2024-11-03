const username = "123"
const password = "123"
const expiredAccess = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNjE3MjA2LCJpYXQiOjE3MzA2MTU0MDYsImp0aSI6ImUyZTZlZDg2ZjJlNzQzNzdiYTFiYTkzNDcyNTRhZDJkIiwidXNlcl9pZCI6IjM0MDVkYmIyLWFiYmYtNDcxYS1hZmNmLWI0NWRkYzUwNTU1NCJ9.fSruBC1PJSClb-VzaGKGe8vibXCtZNrC1bcSPRSX3vk"

describe('home feed', () => {
    beforeEach(() => {
        cy.login(username, password);
      });

    it('load 3 unique recommendations in home feed', () => {
        let userArr = [];
        cy.visit('/home/')
        cy.get('[data-cy="rec"]').each(($recUser) => {
            cy.wrap($recUser).should('exist')
            userArr.push($recUser.text())
          }).then(() => {
            const compare = new Set(userArr);
            expect(compare.size).to.equal(userArr.length)
          })
      })

    //   it('user clicks a recommendation', () => {
    //     cy.visit('/home/')

    //   })
})