import {Pipe, PipeTransform} from "@angular/core";
import {Sort} from "../beans/table";
import {Counter} from "../services/actuator.service";

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {

  private sort: Sort = new Sort();

  transform(array: any[], config: any, counter: Counter): any[] {
    if (!array || !config) {
      counter.count = 0;
      return array;
    }
    let filtered = array;
    for (let term of config.terms) {
      if (term.key && term.value) {
        filtered = filtered.filter(item => item[term.key].toLowerCase().indexOf(term.value.toLowerCase()) > -1);
      }
    }
    if (config.sort) {
      this.sort.by = config.sort;
      filtered = filtered.sort(this.makeSort(config.sort));
    }
    counter.count = filtered.length;
    return filtered;
  }

  makeSort(property: string) {
    let multi = 1;
    if (property.indexOf("-") === 0) {
      multi = -1;
      property = property.substring(1);
    }
    return function (objA: any, objB: any) {
      let a = objA[property] ? objA[property].toLowerCase() : null;
      let b = objB[property] ? objB[property].toLowerCase() : null;
      return (a < b) ? -1 * multi : (a > b) ? multi : 0;
    }
  }
}
