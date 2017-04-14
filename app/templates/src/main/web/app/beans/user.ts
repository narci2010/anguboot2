//"{"authorities":[{"authority":"ROLE_USER"}],"details":{"remoteAddress":"0:0:0:0:0:0:0:1","sessionId":null},"authenticated":true,"principal":{"password":null,"username":"user","authorities":[{"authority":"ROLE_USER"}],"accountNonExpired":true,"accountNonLocked":true,"credentialsNonExpired":true,"enabled":true},"credentials":null,"name":"user"}"
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