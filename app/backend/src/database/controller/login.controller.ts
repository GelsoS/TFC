import { Request, Response } from 'express';
import LoginService from '../service/login.service';

export default class loginController {
  constructor(
    private userLogin = new LoginService(),
  ) {}

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    const { status, message } = await this.userLogin.login(email, password);
    if (status !== 200) return res.status(status).json({ message });
    res.status(status).json({ token: message });
  }

  public validateLogin(req: Request, res: Response) {
    const { authorization } = req.headers
    const {status, role} =  this.userLogin.validateLogin(authorization)
    res.status(status).json(role)
  }
}