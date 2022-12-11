import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import { teamMock } from './mocks/login';
import { Response } from 'superagent';
import { awayTeam, homeTeam, leaderFinal } from './mocks/leader';
import Team from '../database/models/Team';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('rota leaderboard', () => {
    let chaiHttpResponse: Response;
    // beforeEach(() => {
    //     sinon
    //         .stub(Team, 'findAll')
    //         .resolves(teamMock as Team[]);

    // });
    afterEach(() => {
        sinon.restore();
    })

    it('retorno status 200 placar time da casa /homeTeam GET', async () => {
        
        chaiHttpResponse = await chai
        .request(app).get('/leaderboard/home');
        
        sinon
        .stub(Team, "findAll")
        .resolves(teamMock as Team[]);

        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body).to.deep.equal(homeTeam);
    });

    it('retorno status 200 placar time de fora /awayTeam GET', async () => {
        
        chaiHttpResponse = await chai
        .request(app).get('/leaderboard/away');
        
        sinon
        .stub(Team, "findAll")
        .resolves(teamMock as Team[]);

        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body).to.deep.equal(awayTeam);
    });

    it('retorno status 200 placar geral /leaderboard GET', async () => {
        
        chaiHttpResponse = await chai
        .request(app).get('/leaderboard');
        
        sinon
        .stub(Team, "findAll")
        .resolves(teamMock as Team[]);
        
        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body).to.deep.equal(leaderFinal);
    });
})