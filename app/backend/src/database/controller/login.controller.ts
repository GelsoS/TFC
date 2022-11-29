import { Request, Response } from 'express';
import LoginService from '../service/login.service';

export default class loginController {
  // constructor(
  //   private userLogin: LoginService,
  // ) {}
  public loginService = new LoginService();

  public async login(req: Request, res: Response) {
    const { status, message } = await this.loginService.login(req.body);
    if (status !== 200) return res.status(status).json({ message });
    res.status(status).json({ token: message });
  }

  public validateLogin(req: Request, res: Response) {
    const { authorization } = req.headers
    const {status, role} =  this.loginService.validateLogin(authorization)
    res.status(status).json(role)
  }
}