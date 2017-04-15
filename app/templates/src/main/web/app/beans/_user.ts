export class User {
  authorities: Authority[];
  name: string;
}

export class Authority {
  authority: string;
}

export class Credentials {
  name: string;
  password: string;
}

export class OauthToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}