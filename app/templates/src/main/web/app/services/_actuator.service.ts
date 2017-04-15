import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {Response} from "@angular/http";

import "rxjs/add/operator/toPromise";
import {Logger, Loggers} from "../beans/loggers";
import {Dump} from "../beans/dump";<% if (report) { %>
import {Timer} from "../beans/timer";<% } %>
import {ApiService} from "./api.service";
import {Constants} from "../constants";
import {Observable} from "rxjs";
import {LoggerService} from "./logger.service";

export class Counter {
  count: number;

  constructor() {
    this.count = 0;
  }
}

@Injectable()
export class ActuatorService extends ApiService {

  constructor(private http: HttpService, protected constants: Constants, protected loggerService: LoggerService) {
    super(constants, loggerService.getLogger('service.actuator'));
  }

  health(): Observable<any> {
    // ignore error log if body contains DOWN status -> reason of going to catch
    return this.http.get(this.manageUrl + '/health', {withCredentials: true}).map(response => response.json())
      .catch(error => this.buildError(error, (error: Response) => error.status == 503 && error.json().status === 'DOWN'));
  }

  metrics(): Observable<any> {
    return this.http.get(this.manageUrl + '/metrics', {withCredentials: true}).map(response => response.json())
      .catch(error => this.buildError(error));
  }

  dump(): Observable<Dump[]> {
    return this.http.get(this.manageUrl + '/dump', {withCredentials: true}).map(response => response.json() as Dump[])
      .catch(error => this.buildError(error));
  }<% if (report) { %>

  timers(): Observable<Timer[]> {
    return this.http.get(this.apiUrl + '/metrics?limit=100', {withCredentials: true}).map(response => response.json() as Timer[])
      .catch(error => this.buildError(error));
  }<% } %>

  loggers(): Observable<Loggers> {
    return this.http.get(this.manageUrl + '/loggers', {withCredentials: true}).map(response => response.json() as Loggers)
      .catch(error => this.buildError(error));
  }

  updateLevel(logger: Logger, level: string): Observable<any> {
    let body;
    if (level === 'INHERIT') {
      body = {};
    } else {
      body = {'configuredLevel': level};
    }
    return this.http.post(this.manageUrl + '/loggers/' + logger.name, body, {withCredentials: true}).catch(error => this.buildError(error));
  }

}
