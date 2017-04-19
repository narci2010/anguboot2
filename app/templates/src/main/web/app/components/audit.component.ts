import {Component, OnInit} from "@angular/core";
import {ActuatorService} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";
import {Audit, Event} from "../beans/audit";

@Component({
  templateUrl: './audit.component.html'

})
export class AuditComponent implements OnInit {

  private audit: Audit;
  private events: Event[] = [];

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  private refresh(skipNotification: boolean) {
    this.audit = new Audit();
    this.events = [];

    this.spinner.start();
    this.service.audit().subscribe(value => {
      this.audit = value;
      this.events = value.events;
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
