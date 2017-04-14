import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";

import "rxjs/add/operator/toPromise";
import {ApiService} from "./api.service";
import {Constants} from "../constants";
import {Observable} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";
import {LoggerService, Log} from "./logger.service";

@Injectable()
export class CustoService extends ApiService {

  constructor(private http: HttpService, protected constants: Constants, protected storage: LocalStorageService, protected loggerService: LoggerService) {
    super(constants, storage, loggerService.getLogger('service.custo'));
  }

  download(file: string): Observable<any> {
    return this.http.get('/' + file, {withCredentials: true}).map(response => response.text()).catch(error => this.buildError(error));
  }

}
