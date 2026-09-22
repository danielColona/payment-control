const request = require('supertest');
const { expect } = require('chai');

describe('Login Mutation', () => {
    it('deve realizar o login com credenciais válidas', () => {
        request('http://localhost:4000')
        .post ('/graphql')
        .send({
            query: 
            variables: {
  })
})
