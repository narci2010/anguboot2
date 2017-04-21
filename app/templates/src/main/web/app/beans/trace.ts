export class Trace {
  timestamp: number;
  timeTaken: number;
  info: Info;
}
export class Info {
  method: string;
  path: string;
  headers: Headers;
}
export class Headers {
  request: any;
  response: any;
}