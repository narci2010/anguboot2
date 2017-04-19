import {Injectable} from "@angular/core";

@Injectable()
export class UtilService {

  public copy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  public getHexColor( color: string ) : string {
      if( color.indexOf('#') != -1 ) { return color };
      color = color.replace("rgba", "").replace("rgb", "").replace("(", "").replace(")", "");
      let colors = color.split(",");
      return  "#"
              + ( '0' + parseInt(colors[0], 10).toString(16) ).slice(-2)
              + ( '0' + parseInt(colors[1], 10).toString(16) ).slice(-2)
              + ( '0' + parseInt(colors[2], 10).toString(16) ).slice(-2);
  }

}