import {Component, OnInit} from "@angular/core";

import {ActuatorService, Counter} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";

@Component({
  templateUrl: './health.component.html'

})
export class HealthComponent implements OnInit {

  private healthList: any[] = [];
  private raw: any = {};

  private term: string;
  private termStatus: string;

  private filteredCount: Counter = new Counter();

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  public resetFilters(): void {
    this.term = '';
    this.termStatus = undefined;
  }

  private refresh(skipNotification: boolean) {
    this.healthList = [];

    this.resetFilters();

    this.spinner.start();
    this.service.health().subscribe(value => {
      this.process(value, skipNotification);
    }, error => {
      if (error.status) {
        this.process(error, skipNotification);
      } else {
        this.notification.notifyHttpError(error);
      }
      this.spinner.stop();
    });
  }

  public process(value: any, skipNotification: boolean) {
    this.raw = value;
    Object.keys(value).map((key) => {
      let status;
      if (key === 'status') {
        status = value[key];
        this.healthList.push({'name': 'general', 'status': status});
      } else {
        status = value[key].status;
        let health: any = {'name': key, 'status': status};
        for (let i in value[key]) {
          health[i] = value[key][i];
        }
        if (key === 'diskSpace') {
          health.value = Math.round(((health.total - health.free) * 100 / health.total)).toFixed(2);
          health.type = 'success';
          if (health.value > 90) {
            health.type = 'danger';
          }
        }
        this.healthList.push(health);
      }
    });
    this.filteredCount.count = this.healthList.length;
    if (!skipNotification) {
      this.notification.notify(NotificationType.SUCCESS, 'Dashboard refreshed');
    }
    this.spinner.stop();
  }

  ngOnInit(): void {
    this.refresh(true);
  }
}
