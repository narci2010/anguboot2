import {Component, OnInit} from "@angular/core";
import {ActuatorService} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";
import {BeanContext} from "../beans/beans";

@Component({
  templateUrl: './beans.component.html'

})
export class BeansComponent implements OnInit {

  private contexts: BeanContext[];

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  private refresh(skipNotification: boolean) {
    this.contexts = [];

    this.spinner.start();
    this.service.beans().subscribe(value => {
      this.contexts = value;
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
