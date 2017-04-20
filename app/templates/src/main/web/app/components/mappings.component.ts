import {Component, OnInit} from "@angular/core";
import {ActuatorService} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";

@Component({
  templateUrl: './mappings.component.html'

})
export class MappingsComponent implements OnInit {

  private raw: any;
  private mappings: any[];

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  private refresh(skipNotification: boolean) {
    this.raw = {};

    this.spinner.start();
    this.service.mappings().subscribe(value => {
      this.raw = value;
      this.mappings = [];

      let api: any[] = [];
      let manage: any[] = [];
      let others: any[] = [];

      Object.keys(value).map((path) => {
        let mapping = this.map(path, value[path]);
        if(path.indexOf('/api/') > -1){
            api.push(mapping);
        } else if(path.indexOf('/manage/') > -1){
            manage.push(mapping);
        } else {
            others.push(mapping);
        }
      });

      this.mappings.push({name: '[/api/*]', mappings: api});
      this.mappings.push({name: '[/manage/*]', mappings: manage});
      this.mappings.push({name: '[/*]', mappings: others});

      if (!skipNotification) {
        this.notification.notify(NotificationType.SUCCESS, 'Dashboard refreshed');
      }
      this.spinner.stop();
    }, error => {
        this.notification.notifyHttpError(error);
        this.spinner.stop();
    });
  }

  public map(key: string, value: any): any {
    let method = 'methods=[';
    let split = key.split(',');
    let paths: string[] = [];
    if(split[0] && split[0].indexOf('[') > -1){
        paths = split[0].substring(split[0].indexOf('[') + 1, split[0].indexOf(']')).split(' || ');
    } else {
        paths.push(split[0]);
    }
    let methods: string[] = [];
    let produces = '';
    if(split[1] && split[1].indexOf(method) > -1){
        methods = split[1].substring(split[1].indexOf(method)+method.length,split[1].indexOf(']')).split(' || ');
        produces = split[2];
    } else {
        produces = split[1];
    }
    let mapping = {
        paths: paths,
        methods: methods,
        bean: value.bean,
        javaMethod: value.method
    };
    return mapping;
  }

  ngOnInit(): void {
    this.refresh(true);
  }
}
