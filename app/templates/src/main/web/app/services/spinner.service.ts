import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class SpinnerService {
  public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set(value: boolean) {
    this.loaderStatus.next(value);
  }

  start() {
    this.loaderStatus.next(true);
  }

  stop() {
    this.loaderStatus.next(false);
  }
}