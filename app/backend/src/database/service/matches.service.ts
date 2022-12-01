import { ModelStatic } from 'sequelize';
import { IInsertMatch, IReturnLogin } from '../interfaces/interface';
import Matches from '../models/Matches';
import Team from '../models/Team';
import { validaToken } from '../utils/jwt.util';

export default class MatchesService {
  constructor(
    private matchesModel: ModelStatic<Matches> = Matches,
    private teamModel: ModelStatic<Team> = Team,
  ) { }

  private validToken = validaToken;

  public async get() {
    const matches = await this.matchesModel.findAll({
      include: [{
        model: Team, as: 'teamHome',
      },
      {
        model: Team, as: 'teamAway',
      },
      ],
    });
    return { status: 200, matches };
  }

  public async inProgress(progress: number) {
    const progressTrue = await this.matchesModel.findAll({
      where: {
        inProgress: progress,
      },
      include: [{
        model: Team,
        as: 'teamHome',
      },
      {
        model: Team,
        as: 'teamAway',
      }],
    });
    return { status: 200, progressTrue };
  }

  public async save(body:IInsertMatch, authorization: string | undefined):Promise<IReturnLogin> {
    const { status } = this.validToken(authorization);
    if (status) return { status, message: { message: 'Token must be a valid token' } };
    const { homeTeam, awayTeam } = body;
    if (homeTeam === awayTeam) {
      return { status: 422,
        message: {
          message: 'It is not possible to create a match with two equal teams',
        } };
    }
    const verifyExistTeam = [homeTeam, awayTeam].map((team) => (this.teamModel.findByPk(team)));
    const exit = await Promise.all(verifyExistTeam);
    for (let index = 0; index < exit.length; index += 1) {
      if (exit[index] === null) {
        return { status: 404, message: { message: 'There is no team with such id!' } };
      }
    }
    const salved = await this.matchesModel.create({ ...body, inProgress: true });
    return { status: 201, message: salved };
  }

  public async finishMatch(Id: number): Promise<IReturnLogin> {
    await this.matchesModel.update({ inProgress: false }, {
      where: {
        id: Id,
      },
    });
    return { status: 200, message: 'Finished' };
  }

  public async updateId(ID: number, awayTeamGoals: number, homeTeamGoals:number):
  Promise<IReturnLogin> {
    await this.matchesModel.update(
      {
        homeTeamGoals,
        awayTeamGoals,
      },
      { where: {
        id: ID,
      } },
    );
    return { status: 200, message: 'placar atualizado!' };
  }
}
