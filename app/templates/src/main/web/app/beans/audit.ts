export class Audit {
  events: Event[];
}
export class Event {
  timestamp: number;
  principal: string;
  type: string;
  data: any;
}