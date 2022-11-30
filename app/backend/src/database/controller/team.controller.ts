import { Request, Response } from 'express';
import TeamService from '../service/team.service';

export default class teamController {
  // constructor(
  //   private userLogin: LoginService,
  // ) {}
  public teamService = new TeamService();

  public async getTeam(_req: Request, res: Response) {
    const { status, teams } = await this.teamService.get();
    res.status(status).json(teams);
  }

  public async getId(req: Request, res: Response) {
    const { id } = req.params;
    const { status, message } = await this.teamService.getId(+id);
    res.status(status).json(message);
  }
}
