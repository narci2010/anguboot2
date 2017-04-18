import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {LoggerService} from "./logger.service";
import {ApiService} from "./api.service";
import {Constants} from "../constants";
import {Observable} from "rxjs";
import "rxjs/add/operator/toPromise";

@Injectable()
export class SpringService extends ApiService {

  constructor(private http: HttpService, protected constants: Constants, protected loggerService: LoggerService) {
    super(constants, loggerService.getLogger('service.spring'));
  }

  getTitle(): Observable<string> {
    return this.http.get(this.apiUrl + '/welcome', this.buildOptions(), false)
      .map(response => this.json(response).title).catch(error => this.buildError(error));
  }
}
