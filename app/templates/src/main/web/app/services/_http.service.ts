import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Headers, Http, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from "@angular/http";
import {Observable} from "rxjs/Observable";<% if (plugins.security) { %>
import {LocalStorageService} from "angular-2-local-storage";
import {OauthToken} from "../beans/user";<%}%>
import {LoggerService, Log} from "./logger.service";

@Injectable()
export class HttpService extends Http {

  private logger: Log;

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router, <% if (plugins.security) { %>private storage: LocalStorageService, <%}%>protected loggerService: LoggerService) {
    super(backend, defaultOptions);
    this.logger = loggerService.getLogger('service.http');
  }

  get(url: string, options?: RequestOptionsArgs, redirectIf401 = true): Observable<Response> {
    return this.intercept(super.get(url, this.manageOptions(options)), redirectIf401);
  }

  post(url: string, body: any, options?: RequestOptionsArgs, redirectIf401 = true): Observable<Response> {
    return this.intercept(super.post(url, body, this.manageOptions(options, true)), redirectIf401);
  }

  put(url: string, body: string, options?: RequestOptionsArgs, redirectIf401 = true): Observable<Response> {
    return this.intercept(super.put(url, body, this.manageOptions(options, true)), redirectIf401);
  }

  delete(url: string, options?: RequestOptionsArgs, redirectIf401 = true): Observable<Response> {
    return this.intercept(super.delete(url, this.manageOptions(options)), redirectIf401);
  }

  manageOptions(options?: RequestOptionsArgs, defaultContentType?: boolean): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    if (defaultContentType) {
      options.headers.append('Content-Type', 'application/json');
    }<% if (plugins.security) { %>
    if (options.headers.get('Authorization') === null && this.storage.get('token')) {
      let token: OauthToken = this.storage.get('token') as OauthToken;
      options.headers.append('Authorization', 'Bearer ' + token.access_token);
    }<%}%>
    return options;
  }

  intercept(observable: Observable<Response>, redirectIf401: boolean): Observable<Response> {
    return observable.catch((err) => {<% if (plugins.security) { %>
      if (err.status == 401 && redirectIf401) {
        this.logger.debug('Caught 401, redirecting to /login and clear local storage');
        this.storage.clearAll();
        this.router.navigate(['/login'], { queryParams: { authentication: 'disconnected' } });
        return Observable.throw(err);
      } else {<%}%>
        return Observable.throw(err);<% if (plugins.security) { %>
      }<%}%>
    });

  }
}