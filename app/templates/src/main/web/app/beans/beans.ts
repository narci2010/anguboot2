import {ActuatorService, Counter} from "../services/actuator.service";

export class BeanContext {
  context: string;
  parent: string;
  beans: Bean[];
  filteredCount: Counter;

}
export class Bean {
  bean: string;
  scope: string;
  resource: string;
  type: any;
  aliases: string[];
  dependencies: string[];
}