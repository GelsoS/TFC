export interface ILogin {
  email: string,
  password: string
}

export interface IReturnLogin {
  status: number,
  message: string | object,
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

export interface IInsertMatch {
  homeTeam: number,
  awayTeam: number,
  homeTeamGoals: number,
  awayTeamGoals: number
}
