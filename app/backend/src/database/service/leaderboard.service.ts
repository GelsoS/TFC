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
    return result;
  }

  public async Geral():Promise<IScores[]> {
    const geral = [];
    const casa = await this.classification('homeTeam');
    const fora = await this.classification('awayTeam');
    for (let index = 0; index < casa.length; index += 1) {
      geral.push({
        name: casa[index].name,
        totalPoints: casa[index].totalPoints + fora[index].totalPoints,
        totalGames: casa[index].totalGames + fora[index].totalGames,
        totalVictories: casa[index].totalVictories + fora[index].totalVictories,
        totalDraws: casa[index].totalDraws + fora[index].totalDraws,
        totalLosses: casa[index].totalLosses + fora[index].totalLosses,
        goalsFavor: casa[index].goalsFavor + fora[index].goalsFavor,
        goalsOwn: casa[index].goalsOwn + fora[index].goalsOwn,
        goalsBalance: casa[index].goalsBalance + fora[index].goalsBalance,
        efficiency: LeaderBoard.efficiency(casa[index], fora[index]).toFixed(2),
      });
    } return geral;
  }

  public static efficiency(casa:IScores, fora:IScores) {
    let efficiency = 0;
    const TP = casa.totalPoints + fora.totalPoints;
    const TG = casa.totalGames + fora.totalGames;
    efficiency = ((TP / (TG * 3)) * 100);
    return efficiency;
  }
}
