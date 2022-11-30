import { ModelStatic } from 'sequelize';
import Team from '../models/Team';

export default class teamService {
  constructor(
    private teamModel: ModelStatic<Team> = Team,
  ) { }

  public async get() {
    const teams = await this.teamModel.findAll();
    return { status: 200, teams };
  }

  public async getId(id: number) {
    const team = await this.teamModel.findByPk(id);
    return { status: 200, message: team };
  }
}
