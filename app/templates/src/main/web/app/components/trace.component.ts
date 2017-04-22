import {Component, OnInit} from "@angular/core";
import {ActuatorService} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";

@Component({
  templateUrl: './trace.component.html'

})
export class TraceComponent implements OnInit {

  private traces: any[] = [];

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  public getClass(status: string) {
    if(status.indexOf('20') === 0){
      return 'badge-success';
    } else if(status.indexOf('40') === 0){
      return 'badge-warning';
    } else if(status.indexOf('20') === 0){
      return 'badge-danger';
    }
    return 'badge-default';
  }

  private refresh(skipNotification: boolean) {
    this.traces = [];

    this.spinner.start();
    this.service.trace().subscribe(value => {
      this.traces = value;
      if (!skipNotification) {
        this.notification.notify(NotificationType.SUCCESS, 'Dashboard refreshed');
      }
      this.spinner.stop();
    }, error => {
        this.notification.notifyHttpError(error);
        this.spinner.stop();
    });
  }

  ngOnInit(): void {
    this.refresh(true);
  }
}
