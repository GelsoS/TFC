import { ModelStatic } from 'sequelize';
import Matches from '../models/Matches';
import Team from '../models/Team';

export default class MatchesService {
  constructor(
    private matchesModel: ModelStatic<Matches> = Matches,
  ) { }

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
}
