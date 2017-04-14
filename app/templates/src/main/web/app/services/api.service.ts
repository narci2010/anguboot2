import "rxjs/add/operator/toPromise";
import {RequestOptionsArgs, Response} from "@angular/http";
import {HttpError} from "../beans/error";
import {Constants} from "../constants";
import {Observable} from "rxjs";
import {OauthToken} from "../beans/user";
import {LocalStorageService} from "angular-2-local-storage";
import {Log} from "./logger.service";

interface IgnoreLogCallback { (error: Response): boolean }

export class ApiService {

  protected baseUrl: string;
  protected apiUrl: string;
  protected manageUrl: string;

  protected security: string;
  protected oauthClient: string = 'oauth';
  protected oauthSecret: string = 'secret';
  protected oauthToken: OauthToken;

  constructor(protected constants: Constants, protected storage: LocalStorageService, protected logger: Log) {
    this.baseUrl = constants.baseUrl;
    this.apiUrl = constants.baseUrl + '/api';
    this.manageUrl = constants.baseUrl + '/manage';
  }

  protected buildError(error: Response, callback?: IgnoreLogCallback): any {
    let httpError: HttpError;
    let security: string = error.headers.toJSON()['X-Security-Method'];
    if (security) {
        this.security = security[0];
        this.logger.debug('Security method retrieved from server : ' + security);
    }
    if (error.status === 0) {
      httpError = new HttpError();
      httpError.status = error.status;
      httpError.timestamp = new Date();
      httpError.message = "Unable to connect to server";
    } else {
      httpError = (error.json() as HttpError) || null;
      if (!httpError) {
        httpError = new HttpError();
        httpError.status = error.status;
        httpError.timestamp = new Date();
        httpError.message = error.text();
      }
      if (!httpError.message && httpError['error_description']) {
        httpError.message = httpError['error_description'];
      }
    }
    if(!callback || !callback(error)) {
      this.logger.error('Error in service', httpError);
    }
    this.logger.debug('Source error', error);
    return Observable.throw(httpError);
  }

  protected buildOptions(): RequestOptionsArgs {
    if (this.constants.env === 'dev') {
      return { withCredentials: true };
    }
  }

}
