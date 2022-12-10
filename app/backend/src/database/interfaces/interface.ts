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

export interface IScores {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
}

export interface IMatches {
  dataValues:{
    id: number,
    homeTeam: number,
    homeTeamGoals: number,
    awayTeam: number,
    awayTeamGoals: number,
    inProgress: boolean,
    teamHome: [],
    teamAway: []
  }
}
