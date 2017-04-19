export class BeanContext {
  context: string;
  parent: string;
  beans: Bean[];
}
export class Bean {
  bean: string;
  scope: string;
  resource: string;
  type: any;
  aliases: string[];
  dependencies: string[];
}