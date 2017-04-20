import {Component, OnInit} from "@angular/core";
import {ActuatorService, Counter} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";
import {BeanContext} from "../beans/beans";

@Component({
  templateUrl: './beans.component.html'

})
export class BeansComponent implements OnInit {

  private contexts: BeanContext[];

  private term: string;

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  public resetFilters(): void {
    this.term = '';
  }

  private refresh(skipNotification: boolean) {

    this.resetFilters();

    this.spinner.start();
    this.service.beans().subscribe(value => {
      this.contexts = value;
      for(let ctx of this.contexts){
        ctx.filteredCount = new Counter();
        ctx.filteredCount.count = ctx.beans.length;
      }
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
