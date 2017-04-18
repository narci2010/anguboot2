import {Injectable} from "@angular/core";
import {Headers, RequestOptionsArgs} from "@angular/http";
import {HttpService} from "./http.service";
import {LoggerService} from "./logger.service";

import "rxjs/add/operator/toPromise";

import {Credentials, User} from "../beans/user";
import {ApiService} from "./api.service";
import {Constants} from "../constants";
import {Observable} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage/dist";

@Injectable()
export class UserService extends ApiService {

  constructor(private http: HttpService, protected constants: Constants, protected storage: LocalStorageService, protected loggerService: LoggerService) {
    super(constants, loggerService.getLogger('service.user'));
  }

  authenticated(redirectIf401 = true): Promise<boolean> {
    return this.me(redirectIf401).then(() => true).catch(error => false);
  }

  hasRole(role: string, redirectIf401 = true): Promise<boolean> {
    return this.hasRoles([role], redirectIf401);
  }

  hasRoles(roles: string[], redirectIf401 = true): Promise<boolean> {
    return this.me(redirectIf401).then(user => {
      let authorities: string[] = [];
      for (let a of user.authorities) {
        authorities.push(a.authority);
      }
      for (let role of roles) {
        if (authorities.indexOf(role) === -1) {
          return Promise.reject('User ' + user.name + ' does not have role : ' + role);
        }
      }
      return Promise.resolve(true);
    }).catch(() => false);
  }

  me(redirectIf401 = true): Promise<User> {
    if (this.storage.get('user') != null) {
      return Promise.resolve(this.storage.get('user'));
    }
    return this.login(new Credentials, redirectIf401).toPromise();
  }

  login(credentials: Credentials, redirectIf401 = true): Observable<User> {
    let options: RequestOptionsArgs = {};
    let login: boolean = false;
    if (credentials != null && credentials.name != null) {
      login = true;
      if (this.security == 'basic') {
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(credentials.name + ':' + credentials.password));
        options = {headers: headers, withCredentials: true};
      }
    } else {
      options = {withCredentials: true};
    }
    if (login && this.security === 'oauth') {
      let oauthHeaders = new Headers();
      oauthHeaders.append('Authorization', 'Basic ' + btoa(this.oauthClient + ':' + this.oauthSecret));
      oauthHeaders.append('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
      let body: string = 'grant_type=password&username=' + credentials.name + '&password=' + credentials.password;
      return this.http.post(this.baseUrl + '/oauth/token', body, {headers: oauthHeaders}, false).map(response => {
        this.oauthToken = this.json(response);
        this.storage.set('token', this.oauthToken);
        return this.buildMe(this.buildOptions());
      }).catch(error => this.buildError(error));
    }
    return this.buildMe(options, redirectIf401);
  }

  buildMe(options: RequestOptionsArgs, redirectIf401 = true) {
    return this.http.get(this.apiUrl + '/me', options, redirectIf401).map(response => {
      let user = this.json(response);
      this.storage.set('user', user);
      return user;
    }).catch(error => this.buildError(error));
  }

  logout(): Observable<any> {
    this.storage.clearAll();
    return this.http.get(this.apiUrl + '/logout', this.buildOptions()).catch(error => this.buildError(error));
  }
}
