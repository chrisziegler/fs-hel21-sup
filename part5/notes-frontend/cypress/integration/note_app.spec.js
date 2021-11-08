describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Administrator Z',
      username: 'admin',
      password: 'hunter2',
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2021',
    )
  })

  it('login form can be opened', function () {
    cy.contains('log in').click()
  })

  it('user can login', function () {
    cy.contains('log in').click()
    cy.get('#username').type('admin')
    cy.get('#password').type('hunter2')
    cy.get('#login-button').click()

    cy.contains('Administrator Z logged in')
  })
  it('login fails with wrong password', function () {
    cy.contains('log in').click()
    cy.get('#username').type('admin')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error').should('contain', 'wrong credentials')
    cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    cy.get('.error').should('have.css', 'border-style', 'solid')
    cy.get('html').should('not.contain', 'Administrator Z logged in')
  })
  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'hunter2' })
    })

    it('a new note can be created', function () {
      cy.contains('new note').click()
      cy.get('#newnote').type('a note created by cypress')
      cy.get('#note-submit').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({
          content: 'another note cypress',
          important: false,
        })
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress').contains('make not important')
      })
    })
    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function () {
        cy.contains('second note').contains('make important').click()

        cy.contains('second note').contains('make not important')
      })
    })
  })
})
