import {Injectable} from "@angular/core";

declare let CONSTANTS: any;

@Injectable()
export class Constants {
  baseUrl: string = CONSTANTS.base_url;
  env: string = CONSTANTS.env;
  version: number = CONSTANTS.version;
  logLevel: string = CONSTANTS.log_level;
  mock_http: boolean = CONSTANTS.mock_http;
}
