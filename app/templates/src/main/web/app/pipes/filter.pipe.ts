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
    if(config.terms){
        for (let term of config.terms) {
          if (term.key && term.value) {
                filtered = filtered.filter(item => {
                    let itemValue = item[term.key] && item[term.key].toLowerCase ? item[term.key].toLowerCase() : item[term.key];
                    let termValue = term.value && term.value.toLowerCase ? term.value.toLowerCase() : term.value;
                    if(!itemValue && !termValue){
                        return true;
                    } else if (!itemValue || !termValue) {
                        return false;
                    } else if(term.strict){
                        return itemValue.length === termValue.length && itemValue.indexOf(termValue) === 0;
                    } else {
                        return itemValue && itemValue.indexOf(termValue) > -1;
                    }
                });
          }
        }
    }
    if (config.sort) {
      this.sort.by = config.sort;
      filtered.sort(this.makeSort(config.sort));
    } else {
      filtered.sort();
    }
    if(counter){
        counter.count = filtered.length;
    }
    return filtered;
  }

  makeSort(property: string) {
    let multi = 1;
    if (property.indexOf("-") === 0) {
      multi = -1;
      property = property.substring(1);
    }
    return function (objA: any, objB: any) {
      let a = objA[property] && objA[property].toLowerCase ? objA[property].toLowerCase() : objA[property];
      let b = objB[property] && objB[property].toLowerCase ? objB[property].toLowerCase() : objB[property];
      return (a < b) ? -1 * multi : (a > b) ? multi : 0;
    }
  }
}
