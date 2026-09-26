const request = require('supertest')
const { expect } = require('chai')

describe('Mutation - Criar Funcionário', () => {
    let token

    before(async () => {
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
        token = resposta.body.data.login.token
    })

    it('deve criar um funcionário quando preencho os campos obrigatórios de forma válida', async () => {
        const cpf = String(Date.now())
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
                    }
                }`,
                variables: {
                    input: {
                        nome: "John Doe",
                        cpf: cpf,
                        salario_base: 5000.00,
                        admissao: "2023-01-01",
                        desligamento: null
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors).to.be.undefined
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
        expect(resposta.body.data.criarFuncionario).to.have.property('cpf', cpf)
        expect(resposta.body.data.criarFuncionario).to.have.property('nome', 'John Doe')
        expect(resposta.body.data.criarFuncionario).to.have.property('salario_base', 5000)
        expect(resposta.body.data.criarFuncionario).to.have.property('admissao', '2023-01-01')
        expect(resposta.body.data.criarFuncionario.desligamento).to.be.null
    })
})
