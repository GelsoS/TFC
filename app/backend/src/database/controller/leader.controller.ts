import { Request, Response } from 'express';
import { IScores } from '../interfaces/interface';
import LeaderBoard from '../service/leaderboard.service';

export default class Leader {
  constructor(
    private leader = new LeaderBoard(),
  ) { }

  private static sort(result:IScores[]):IScores[] {
    result.sort((a, b) =>
      b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsOwn);
    return result;
  }

  public async leaderBoardHome(_req: Request, res: Response):Promise<void> {
    const result = await this.leader.classification('homeTeam');
    Leader.sort(result);
    res.status(200).json(result);
  }

  public async leaderBoardAway(_req: Request, res: Response):Promise<void> {
    const result = await this.leader.classification('awayTeam');
    Leader.sort(result);
    res.status(200).json(result);
  }

  public async leaderBoard(_req: Request, res: Response): Promise<void> {
    const result = await this.leader.Geral();
    Leader.sort(result);
    res.status(200).json(result);
  }
}
