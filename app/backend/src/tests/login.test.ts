
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import User from '../database/models/User';
import { login, loginValidMock, semEmail, semSenha, token } from './mocks/login';
import { Response } from 'superagent';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('rota login', () => {
  let chaiHttpResponse: Response;
  beforeEach(async () => {

  });
  afterEach(() => {
    sinon.restore();
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
    sinon
      .stub(User, "findOne")
      .resolves(loginValidMock as User);

    sinon.stub(bcrypt, 'compareSync').returns(true);

    const chaiHttpResponse = await chai
      .request(app).post('/login').send(loginValidMock);

    expect(chaiHttpResponse.status).to.be.eq(200);
    // expect(chaiHttpResponse.body).to.deep.eq(token);
    expect(chaiHttpResponse.body).to.have.key('token');
  });

  it('erro ao nao informar email de acesso', async () => {
    sinon
      .stub(User, "findOne")
      .resolves(loginValidMock as User);

    const chaiHttpResponse = await chai
      .request(app).post('/login').send(semEmail);

    expect(chaiHttpResponse.status).to.be.eq(400);
    expect(chaiHttpResponse.body).to.deep.equal({ "message": "All fields must be filled" });
  });

  it('erro ao nao informar senha de acesso', async () => {
    sinon
      .stub(User, "findOne")
      .resolves(loginValidMock as User);

    const chaiHttpResponse = await chai
      .request(app).post('/login').send(semSenha);

    expect(chaiHttpResponse.status).to.be.eq(400);
    expect(chaiHttpResponse.body).to.deep.equal({ "message": "All fields must be filled" });
  });


  it('retorno de token invalido status 401', async () => {

    const chaiHttpResponse = await chai
      .request(app).get('/login/validate').auth('authorization', token.token);

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal({
      message: "Invalid token",
      status: 401
    })
  })

   it('retorno de token com status 200', async () => {
    const { body } = await chai
      .request(app).post('/login').send(loginValidMock);

    const chaiHttpResponse = await chai
      .request(app).get('/login/validate').set('authorization', body.token);

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal({ "role": "admin" })
  })
});

// describe('Login Controller',()=>{
//   it()
// })