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
  private configuration: any[] = [];
  private ports: any[] = [];
  private args: any[] = [];

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  private refresh(skipNotification: boolean) {
    this.env = new Env();
    this.configuration = [];
    this.ports = [];
    this.args = [];

    this.spinner.start();
    this.service.env().subscribe(value => {
      this.env = value;

      let systemProperties: any[] = [];
      Object.keys(value.systemProperties).map((key) => {
        systemProperties.push({key: key, value: value.systemProperties[key]});
      });
      this.configuration.push({name: '[system:properties]', properties: systemProperties});

      let systemEnvironment: any[] = [];
      Object.keys(value.systemEnvironment).map((key) => {
        systemEnvironment.push({key: key, value: value.systemEnvironment[key]});
      });
      this.configuration.push({name: '[system:environment]', properties: systemEnvironment});

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
      if(value['server.ports']){
        Object.keys(value['server.ports']).map((key) => {
          this.ports.push({key: key, value: value['server.ports'][key]});
        });
      }
      if(value['server.ports']){
        Object.keys(value['commandLineArgs']).map((key) => {
          this.args.push({key: key, value: value['commandLineArgs'][key]});
        });
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
