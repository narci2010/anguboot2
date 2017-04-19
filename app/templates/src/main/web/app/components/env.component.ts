import {Component, OnInit} from "@angular/core";
import {ActuatorService} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";
import {Env} from "../beans/env";

@Component({
  templateUrl: './env.component.html'

})
export class EnvComponent implements OnInit {

  private env: Env;
  private properties: any[] = [];
  private environment: any[] = [];
  private configuration: any[] = [];

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  private refresh(skipNotification: boolean) {
    this.env = new Env();
    this.properties = [];
    this.environment = [];
    this.configuration = [];

    this.spinner.start();
    this.service.env().subscribe(value => {
      this.env = value;

      Object.keys(value.systemProperties).map((key) => {
        this.properties.push({key: key, value: value.systemProperties[key]});
      });
      Object.keys(value.systemEnvironment).map((key) => {
        this.environment.push({key: key, value: value.systemEnvironment[key]});
      });
      let config = 'applicationConfig: ';
      Object.keys(value).map((conf) => {
        if(conf.indexOf(config) === 0){
            let properties: any[] = [];
            Object.keys(value[conf]).map((key) => {
                properties.push({key: key, value: value[conf][key]});
            });
            this.configuration.push({name: conf.substring(config.length), properties: properties});
        }
      });

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
