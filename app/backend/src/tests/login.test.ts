
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import User from '../database/models/User';
import { login, semEmail, semSenha, token } from './mocks/login';
import { Response } from 'superagent';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('rota login', () => {
   let chaiHttpResponse: Response;
  beforeEach(async () => {
    sinon
      .stub(User, "findOne")
      .resolves(login as User);
  });
  afterEach(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('retorno status 401 dados incorretos na rota /login post', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send(login);

    expect(chaiHttpResponse.status).to.be.eq(401);
    expect(chaiHttpResponse.body).to.deep.equal({
      "message": "Incorrect email or password"
    });
  });

  it('retorno status 200 dados corretos na rota /login post', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({
        email: "admin@admin.com",
        password: "secret_admin"
      });

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal(token);
  });

  it('erro ao nao informar email de acesso', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send(semEmail);

    expect(chaiHttpResponse.status).to.be.eq(400);
    expect(chaiHttpResponse.body).to.deep.equal({ "message": "All fields must be filled" });
  });

  it('erro ao nao informar senha de acesso', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send(semSenha);

    expect(chaiHttpResponse.status).to.be.eq(400);
    expect(chaiHttpResponse.body).to.deep.equal({ "message": "All fields must be filled" });
  });

  it('retorno de token com status 200', async () => {
    chaiHttpResponse = await chai
       .request(app).get('/login/validate').auth('authorization', token.token);
 
    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal({ "role": "admin" })
  })
});

// describe('Login Controller',()=>{
//   it()
// })