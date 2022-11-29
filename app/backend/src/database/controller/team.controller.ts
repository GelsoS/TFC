import { Request, Response } from 'express';
import teamService from '../service/team.service';

export default class teamController {
  // constructor(
  //   private userLogin: LoginService,
  // ) {}
  public teamService = new teamService();

  public async getTeam(_req: Request, res: Response) {
    const { status, teams } = await this.teamService.get();
    console.log(teams);

    res.status(status).json(teams);
  }

  public async getId(req: Request, res: Response) {
    const { id } = req.params
    const { status, message } = await this.teamService.getId(+id)
    res.status(status).json( message )
  }

}