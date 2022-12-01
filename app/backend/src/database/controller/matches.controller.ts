import { Request, Response } from 'express';
import MatchesService from '../service/matches.service';

export default class matchesController {
  constructor(
    private matches = new MatchesService(),
  ) { }

  public async get(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress) {
      let tipo;
      if (inProgress === 'true') tipo = 1; else tipo = 0;
      const { status, progressTrue } = await this.matches.inProgress(tipo);
      return res.status(status).json(progressTrue);
    }
    const { status, matches } = await this.matches.get();
    res.status(status).json(matches);
  }

  public async salved(req:Request, res:Response) {
    const { authorization } = req.headers;
    const { status, message } = await this.matches.save(req.body, authorization);
    res.status(status).json(message);
  }

  public async finishMatch(req:Request, res:Response) {
    const { params: { id } } = req;
    console.log(typeof id, id);
    const { status, message } = await this.matches.finishMatch(+id);
    res.status(status).json({ message });
  }
}
