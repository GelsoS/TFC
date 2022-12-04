import MatchesService from '../service/matches.service';

export default class LeaderUtils {
  constructor(
    private _match = new MatchesService(),
  ) { }

  public async homeTeam(id:number): Promise<number[]> {
    let pontos = 0; let vitorias = 0; let empates = 0; let derrotas = 0; let golsCasa = 0;
    let golsFora = 0;
    const { progressTrue } = await this._match.inProgress(0);
    const matches = progressTrue.filter(({ dataValues }) => dataValues.homeTeam === id);

    for (let index = 0; index < matches.length; index += 1) {
      golsCasa += matches[index].dataValues.homeTeamGoals;
      golsFora += matches[index].dataValues.awayTeamGoals;
      if (matches[index].dataValues.homeTeamGoals === matches[index].dataValues.awayTeamGoals) {
        empates += 1; pontos += 1;
      } else
      if (matches[index].dataValues.homeTeamGoals > matches[index].dataValues.awayTeamGoals) {
        vitorias += 1; pontos += 3;
      } else { pontos += 0; derrotas += 1; }
    }
    const jogos = matches.length;
    return [pontos, jogos, vitorias, empates, derrotas, golsCasa, golsFora];
  }
}
