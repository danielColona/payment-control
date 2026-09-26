describe('Mutation - Login', () => {
  it('deve realizar o login com sucesso quando as credenciais forem válidas', () => {
    cy.request({
          method: 'POST',
          url: 'http://localhost:4000/graphql',
          body: {
              query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                    }`,
              variables: {
                        "email": "admin@admin.com",
                        "senha": "123456"
              }
          }
    }).then((response) => {
       expect(response.status).to.eq(200)
       expect(response.body.data.login.token).to.be.a('string')
       expect(response.body.data.login).to.have.property('token')
       expect(response.body.data.login.token).to.not.be.empty
      })
  })

  it('não deve realizar o login com sucesso quando as credenciais forem inválidas', () => {
    cy.request({
          method: 'POST',
          url: 'http://localhost:4000/graphql',
          body: {
              query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                    }`,
              variables: {
                        "email": "admin@admin.com",
                        "senha": "1234567"
              }
          }
    }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
      })
  })
})