import {Component, OnInit} from "@angular/core";

import {ActuatorService, Counter} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {Logger, Loggers} from "../beans/loggers";
import {NotificationService, NotificationType} from "../services/notification.service";

@Component({
  templateUrl: './loggers.component.html'
})
export class LoggersComponent implements OnInit {

  private loggers: Logger[] = [];
  private levels: any[] = [];

  private page: number = 1;
  private pageSize: number = 10;
  private pageSizes: number[] = [5, 10, 20, 50, 100];
  private raw: Loggers;

  private term: string;
  private levelTerm: string;

  private filteredCount: Counter = new Counter();

  private defaultHeaderClass: any = {
    name: 'fa fa-sort',
    configuredLevel: 'fa fa-sort',
    effectiveLevel: 'fa fa-sort'
  };

  copy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  private headerClass: any = this.copy(this.defaultHeaderClass);

  private sort: string;

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  doSort(sort: string) {
    this.headerClass = this.copy(this.defaultHeaderClass);
    if (this.sort && this.sort === sort) {
      this.sort = '-' + sort;
      this.headerClass[sort] = 'fa fa-sort-desc';
    } else {
      this.sort = sort;
      this.headerClass[sort] = 'fa fa-sort-asc';
    }
  }

  public getClass(level: string, test = true) {
    if (!test) {
      return 'badge-default';
    }
    switch (level) {
      case 'ALL':
        return 'badge-primary';
      case 'INFO':
        return 'badge-info';
      case 'WARN':
        return 'badge-warning';
      case  'ERROR':
        return 'badge-danger';
      case 'DEBUG':
        return 'badge-success';
      case 'TRACE':
        return 'badge-primary';
      case 'OFF':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  }

  public resetFilters(): void {
    this.term = '';
    this.levelTerm = undefined;
  }

  public refresh(skipNotification: boolean): void {
    this.loggers = [];
    this.levels = [];

    this.resetFilters();

    this.spinner.start();
    this.service.loggers().subscribe(value => {
      this.raw = value;
      for (let i in value.levels) {
        this.levels.push({'name': value.levels[i], 'class': this.getClass(value.levels[i])});
      }
      for (let key in value.loggers) {
        let logger = {
          name: key,
          configuredLevel: value.loggers[key].configuredLevel,
          effectiveLevel: value.loggers[key].effectiveLevel,
          configuredLevelClass: this.getClass(value.loggers[key].configuredLevel),
          effectiveLevelClass: this.getClass(value.loggers[key].effectiveLevel)
        };
        this.loggers.push(logger);
      }
      this.filteredCount.count = this.loggers.length;

      this.spinner.stop();
      if (!skipNotification) {
        this.notification.notify(NotificationType.SUCCESS, 'Dashboard refreshed');
      }
    }, error => {
      this.notification.notifyHttpError(error);
      this.spinner.stop();
    });
  }

  public updateLevel(logger: Logger, level: string) {
    this.spinner.start();
    this.service.updateLevel(logger, level).subscribe(() => {
      this.refresh(true);
      this.notification.notify(NotificationType.SUCCESS, 'Logger updated', logger.name);
    }, error => {
      this.notification.notifyHttpError(error);
      this.spinner.stop();
    });
  };

  ngOnInit(): void {
    this.refresh(true);
  }
}
