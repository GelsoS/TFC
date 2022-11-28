export interface ILogin {
  email: string,
  password: string
}

export interface IReturnLogin {
  status: number,
  message: string,
}

export interface IUser {
  id: number;
  username: string;
  role: string;
  email: string;
  password: string;
}

export interface IRole {
  status: number;
  role: string | object;
}