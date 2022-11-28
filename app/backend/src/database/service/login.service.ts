import { ModelStatic } from 'sequelize';
import { compareSync } from 'bcryptjs';
import { createToken, validaToken } from '../utils/jwt.util';
import User from '../models/User';
import { ILogin, IReturnLogin, IRole } from '../interfaces/interface';

export default class LoginService {
  constructor(
    private userModel: ModelStatic<User> = User,
  ) {}

  public async login({ email, password }: ILogin): Promise<IReturnLogin> {
    if (!email || !password) return { status: 400, message: 'All fields must be filled' };
    const user = await this.userModel.findOne({ where: { email } });

    if (!user || !compareSync(password, user.password)) {
      return { status: 401, message: 'Incorrect email or password' };
    }

    const token = createToken(user);
    return { status: 200, message: token };
  }

  public validateLogin(token: string| undefined): IRole{
    const role = validaToken(token)
    return {status: 200, role}
  }
}
