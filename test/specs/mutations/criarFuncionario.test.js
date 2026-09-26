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

    it('não deve criar um funcionário quando não informo o salário base', async () => {
        const cpf = String(Date.now())
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                    }
                }`,
                variables: {
                    input: {
                        nome: "John Doe",
                        cpf: cpf,
                        admissao: "2023-01-01"
                    }
                }
            })

        expect(resposta.status).to.equal(400)
        expect(resposta.body.data).to.be.undefined
        expect(resposta.body.errors[0].extensions).to.have.property('code', 'BAD_USER_INPUT')
        expect(resposta.body.errors[0].message).to.include('Field "salario_base" of required type "Float!" was not provided.')
    })

    it('não deve criar um funcionário quando informo o salário base negativo', async () => {
        const cpf = String(Date.now())
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                    }
                }`,
                variables: {
                    input: {
                        nome: "John Doe",
                        cpf: cpf,
                        salario_base: -100,
                        admissao: "2023-01-01"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data).to.be.null
        expect(resposta.body.errors[0].extensions).to.have.property('code', 'BAD_USER_INPUT')
        expect(resposta.body.errors[0]).to.have.property('message', 'Salário base não pode ser negativo.')
    })

    it('não deve criar um funcionário quando informo o desligamento anterior à admissão', async () => {
        const cpf = String(Date.now())
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                    }
                }`,
                variables: {
                    input: {
                        nome: "John Doe",
                        cpf: cpf,
                        salario_base: 5000.00,
                        admissao: "2023-01-10",
                        desligamento: "2023-01-01"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data).to.be.null
        expect(resposta.body.errors[0].extensions).to.have.property('code', 'BAD_USER_INPUT')
        expect(resposta.body.errors[0]).to.have.property('message', 'Desligamento não pode ser anterior à admissão.')
    })
})
