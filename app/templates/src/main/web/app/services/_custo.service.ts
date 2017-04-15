import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {ApiService} from "./api.service";
import {Constants} from "../constants";
import {Observable} from "rxjs";
import {LoggerService} from "./logger.service";
import "rxjs/add/operator/toPromise";

@Injectable()
export class CustoService extends ApiService {

  constructor(private http: HttpService, protected constants: Constants, protected loggerService: LoggerService) {
    super(constants, loggerService.getLogger('service.custo'));
  }

  download(file: string): Observable<any> {
    return this.http.get('/' + file, {withCredentials: true}).map(response => response.text()).catch(error => this.buildError(error));
  }

}
