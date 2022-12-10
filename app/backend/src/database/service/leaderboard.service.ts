import { IScores } from '../interfaces/interface';
import LeaderUtils from '../utils/leader.util';
import TeamService from './team.service';

export default class LeaderBoard {
  constructor(
    private teams = new TeamService(),
    private utils = new LeaderUtils(),
  ) {
    // this.sorted = this.sorted.bind(this);
  }

  public async classification(tipo: string):Promise<IScores[]> {
    const { teams } = await this.teams.get();
    const promessa = teams.map(({ dataValues }) => this.utils.homeTeam(dataValues.id, tipo));
    const ponts = await Promise.all(promessa);
    const result = teams.map(({ dataValues }, index) => (
      {
        name: dataValues.teamName,
        totalPoints: ponts[index][0],
        totalGames: ponts[index][1],
        totalVictories: ponts[index][2],
        totalDraws: ponts[index][3],
        totalLosses: ponts[index][4],
        goalsFavor: ponts[index][5],
        goalsOwn: ponts[index][6],
        goalsBalance: ponts[index][5] - ponts[index][6],
        efficiency: ((ponts[index][0] / (ponts[index][1] * 3)) * 100).toFixed(2),
      }
    ));
    return LeaderBoard.sorted(result);
  }

  private static sorted(placar: IScores[]): IScores[] {
    placar.sort((a, b) =>
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn);
    return placar;
  }
}
