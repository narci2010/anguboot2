import {Pipe, PipeTransform} from "@angular/core";
import {I18nService} from "../services/i18n.service";

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {

  constructor(private i18n: I18nService) {
  }

  transform(key: string, interpolation: any[] = []): string {
    let translation = this.i18n.get(key, interpolation);
    return translation ? translation : key;
  }
}
