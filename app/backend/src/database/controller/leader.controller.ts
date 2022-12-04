import { Request, Response } from 'express';
import LeaderBoard from '../service/leaderboard.service';

export default class Leader {
  constructor(
    private leader = new LeaderBoard(),
  ) { }

  public async leaderBoard(_req: Request, res: Response) {
    const result = await this.leader.classification();
    result.sort((a, b) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn
    ));
    res.status(200).json(result);
  }
}
