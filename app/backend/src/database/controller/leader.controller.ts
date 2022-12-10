import { Request, Response } from 'express';
import LeaderBoard from '../service/leaderboard.service';

export default class Leader {
  constructor(
    private leader = new LeaderBoard(),
  ) { }

  public async leaderBoardHome(_req: Request, res: Response):Promise<void> {
    const result = await this.leader.classification('homeTeam');
    res.status(200).json(result);
  }

  public async leaderBoardAway(_req: Request, res: Response):Promise<void> {
    const result = await this.leader.classification('awayTeam');
    res.status(200).json(result);
  }
}
