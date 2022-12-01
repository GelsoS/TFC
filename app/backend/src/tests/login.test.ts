
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import User from '../database/models/User';
import { login, loginValidMock, semEmail, semSenha, teamMock, token } from './mocks/login';
import { Response } from 'superagent';
import Team from '../database/models/Team';
import Matches from '../database/models/Matches';
import { existTeam, falseMatches, getMatches, returnSave, saveMock, saveMockRepet, trueMatches } from './mocks/matches';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('rota login', () => {
  let chaiHttpResponse: Response;
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
      message: "Token must be a valid token",
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

describe('rota Team', () => {
  let chaiHttpResponse: Response;
  afterEach(() => {
    sinon.restore();
  })

  it('Desenvolva o endpoint /teams no back-end de forma que ele possa retornar todos os ' +
    'times corretamente', async () => {
      sinon
        .stub(Team, "findAll")
        .resolves(teamMock as Team[]);

      chaiHttpResponse = await chai
        .request(app).get('/teams');

      expect(chaiHttpResponse.status).to.be.eq(200);
      expect(chaiHttpResponse.body).to.deep.equal(teamMock);
    })

  it('Desenvolva o endpoint /teams/:id no back-end de forma que ele possa retornar dados de um time específico', async () => {
    sinon
      .stub(Team, "findOne")
      .resolves({
        "id": 3,
        "teamName": "Botafogo"
      } as Team);

    chaiHttpResponse = await chai
      .request(app).get('/teams/3');

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal({
      id: 3,
      teamName: "Botafogo"
    });
  })
})

describe('rota matches', () => {
  let chaiHttpResponse: Response;
  afterEach(() => {
    sinon.restore();
  })

  it('Desenvolva o endpoint /matches de forma que seja possível buscar todas partidas em andamento ', async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves(getMatches as unknown as Matches[]);

    chaiHttpResponse = await chai
      .request(app).get('/matches');

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal(getMatches);
  })

  it('Desenvolva o endpoint /matches de forma que seja possível filtrar todas partidas em andamento abertas', async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves(trueMatches as unknown as Matches[]);

    chaiHttpResponse = await chai
      .request(app).get('/matches').query({ inProgress: true });

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal(trueMatches);
  })

  it('Desenvolva o endpoint /matches de forma que seja possível filtrar todas partidas finalizadas', async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves(falseMatches as unknown as Matches[]);

    chaiHttpResponse = await chai
      .request(app).get('/matches').query({ inProgress: false });

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal(falseMatches);
  })

  it('endpoint /matches p/ salvar uma partida com o status de inProgress como true no banco de dados', async () => {

    sinon
      .stub(Matches, "create")
      .resolves(returnSave as unknown as Matches);

    chaiHttpResponse = await chai
      .request(app).post('/matches').set('authorization', token.token).send(saveMock);

    expect(chaiHttpResponse.status).to.be.eq(201);
    expect(chaiHttpResponse.body).to.deep.equal(returnSave);
  })

  it('teste token invalido', async () => {

    sinon
      .stub(Matches, "create")
      .resolves(returnSave as unknown as Matches);

    chaiHttpResponse = await chai
      .request(app).post('/matches').auth('authorization', token.token).send(saveMock);

    expect(chaiHttpResponse.status).to.be.eq(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token must be a valid token' });
  })


  it('endpoint /matches p/ salvar uma partida com times iguais', async () => {

    sinon
      .stub(Matches, "create")
      .resolves({ message: 'It is not possible to create a match with two equal teams' } as unknown as Matches);

    chaiHttpResponse = await chai
      .request(app).post('/matches').set('authorization', token.token).send(saveMockRepet);

    expect(chaiHttpResponse.status).to.be.eq(422);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
  })

  it('endpoint /matches p/ salvar uma partida com times inexistentes', async () => {

    sinon
      .stub(Matches, "create")
      .resolves({ message: 'There is no team with such id!' } as unknown as Matches);

    chaiHttpResponse = await chai
      .request(app).post('/matches').set('authorization', token.token).send(existTeam);

    expect(chaiHttpResponse.status).to.be.eq(404);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'There is no team with such id!' });
  })

  it('endpoint /matches/:id/finish alterar o status inProgress de uma partida para false no banco de dados', async () => {

    sinon
      .stub(Matches, "update")
      .resolves([1]);

    chaiHttpResponse = await chai
      .request(app).patch('/matches/1/finish')

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Finished' });
  })

  it('Desenvolva o endpoint /matches/:id de forma que seja possível atualizar partidas em andamento', async () => {

    sinon
      .stub(Matches, "update")
      .resolves([5]);

    chaiHttpResponse = await chai
      .request(app).patch('/matches/5')

    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal( "placar atualizado!" );
  })
})