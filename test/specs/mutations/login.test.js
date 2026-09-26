const request = require('supertest');
const { expect } = require('chai');

describe('Login Mutation', () => {
    it('deve realizar o login com credenciais válidas', async () => {
       const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                        }
                }`,
                variables: {
                    "email": "admin@admin.com",
                    "senha": "123456"
                }
            })  
        expect(resposta.status).to.equal(200);
        expect(resposta.body.data.login).to.have.property('token')
    })
    
    it('não deve realizar o login com credenciais válidas', async () => {
       const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                        }
                }`,
                variables: {
                    "email": "admin@admin.com",
                    "senha": "1234567"
                }
            })  
        expect(resposta.status).to.equal(200);
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    })
    it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {  
                    email: "admin@admin.com",
                    senha: "123456"
                }
            })
        
        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    })
})
