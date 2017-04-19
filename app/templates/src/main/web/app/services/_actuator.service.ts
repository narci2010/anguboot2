import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {Response} from "@angular/http";
import {Logger, Loggers} from "../beans/loggers";
import {BeanContext} from "../beans/beans";
import {Audit} from "../beans/audit";
import {Env} from "../beans/env";
import {Trace} from "../beans/trace";
import {Dump} from "../beans/dump";<% if (report) { %>
import {Timer} from "../beans/timer";<% } %>
import {ApiService} from "./api.service";
import {Constants} from "../constants";
import {Observable} from "rxjs";
import {LoggerService} from "./logger.service";
import "rxjs/add/operator/toPromise";

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
    // ignore error log if body status which is not a number
    return this.http.get(this.manageUrl + '/health', this.buildOptions()).map(response => this.json(response))
      .catch(error => this.buildError(error, (error: Response) => !Number.isInteger(error.json().status)));
  }

  metrics(): Observable<any> {
    return this.http.get(this.manageUrl + '/metrics', this.buildOptions()).map(response => this.json(response))
      .catch(error => this.buildError(error));
  }

  trace(): Observable<Dump[]> {
    return this.http.get(this.manageUrl + '/trace', this.buildOptions()).map(response => this.json(response) as Trace[])
      .catch(error => this.buildError(error));
  }

  beans(): Observable<BeanContext[]> {
    return this.http.get(this.manageUrl + '/beans', this.buildOptions()).map(response => this.json(response) as BeanContext[])
      .catch(error => this.buildError(error));
  }

  audit(): Observable<Audit> {
    return this.http.get(this.manageUrl + '/auditevents', this.buildOptions()).map(response => this.json(response) as Audit)
      .catch(error => this.buildError(error));
  }

  env(): Observable<Env> {
    return this.http.get(this.manageUrl + '/env', this.buildOptions()).map(response => this.json(response) as Env)
      .catch(error => this.buildError(error));
  }

  mappings(): Observable<any> {
    return this.http.get(this.manageUrl + '/mappings', this.buildOptions()).map(response => this.json(response))
      .catch(error => this.buildError(error));
  }

  dump(): Observable<Dump[]> {
    return this.http.get(this.manageUrl + '/dump', this.buildOptions()).map(response => this.json(response) as Dump[])
      .catch(error => this.buildError(error));
  }<% if (report) { %>

  timers(): Observable<Timer[]> {
    return this.http.get(this.apiUrl + '/metrics?limit=100', this.buildOptions()).map(response => this.json(response) as Timer[])
      .catch(error => this.buildError(error));
  }<% } %>

  loggers(): Observable<Loggers> {
    return this.http.get(this.manageUrl + '/loggers', this.buildOptions()).map(response => this.json(response) as Loggers)
      .catch(error => this.buildError(error));
  }

  updateLevel(logger: Logger, level: string): Observable<any> {
    let body;
    if (level === 'INHERIT') {
      body = {};
    } else {
      body = {'configuredLevel': level};
    }
    return this.http.post(this.manageUrl + '/loggers/' + logger.name, body, this.buildOptions()).catch(error => this.buildError(error));
  }

}
