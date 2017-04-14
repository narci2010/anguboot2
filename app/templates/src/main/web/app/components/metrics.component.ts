import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {DatePipe} from "@angular/common";

import {ActuatorService} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {Dump} from "../beans/dump";
import {NotificationService, NotificationType} from "../services/notification.service";
import {Observable} from "rxjs";

@Component({
  templateUrl: './metrics.component.html'

})
export class MetricsComponent implements OnInit {
  @ViewChild("textColor") textColor:ElementRef;

  private timers: any;

  private statusCodes: string[] = ['all', '200', '400', '401', '404', '500'];
  private isDataAvailable: boolean = false;

  private metrics: any[] = [];
  private metricsHttp = {};
  private metricsServices = {};

  private threads = {};
  private threadsData: number[] = [];
  private threadsLabels: string[] = [];

  private metricsServicesArray: any[] = [];

  private graphs = {};
  private graphsArray: any[] = [];

  private series: string[] = ['Mean', 'Min', 'Max'];

  private pieChartLabels: string[] = [];
  private pieChartData: number[] = [];
  private pieChartType: string = 'pie';
  private dumps: Dump[];

  private fontColor: string;
  private graphOptions: any;
  private threadsOptions: any;

  constructor(private service: ActuatorService, private spinner: SpinnerService, private date: DatePipe, private notification: NotificationService) {
  }

  private chartClicked(e: any): void {
    console.log('Chart clicked ! ', e);
  }

  private nameSortFunction(a: any, b: any) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  private getHexColor( color: string ) : string {
      if( color.indexOf('#') != -1 ) { return color };
      color = color.replace("rgba", "").replace("rgb", "").replace("(", "").replace(")", "");
      let colors = color.split(",");
      return  "#"
              + ( '0' + parseInt(colors[0], 10).toString(16) ).slice(-2)
              + ( '0' + parseInt(colors[1], 10).toString(16) ).slice(-2)
              + ( '0' + parseInt(colors[2], 10).toString(16) ).slice(-2);
  }

  private refresh(skipNotification: boolean) {

    let packageName = 'io.fonimus';

    let observables: Observable<any>[] = [];

    this.spinner.start();

    observables.push(this.service.metrics());
    observables.push(this.service.dump());
    observables.push(this.service.timers());

    this.graphOptions = {
    legend: {
      position: 'bottom',
      labels: {
        fontColor: this.fontColor
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: this.fontColor
        }
      }],
      yAxes: [{
        ticks: {
          fontColor: this.fontColor
        },
      }]
    }
    };

    this.threadsOptions = {
    legend: {
      position: 'bottom',
      labels: {
        fontColor: this.fontColor
      }
    }
    };

    Observable.forkJoin(observables).subscribe(result => {
      this.metrics = result[0];
      this.dumps = result[1];
      this.timers = result[2];

      this.metricsHttp = {};
      this.metricsServices = {};

      for (let s in this.statusCodes) {
        this.metricsHttp[this.statusCodes[s]] = 0;
      }
      for (let name in this.metrics) {
        if (name.indexOf('counter.status.') === 0) {
          for (let i in this.statusCodes) {
            let status = this.statusCodes[i];
            if (name.indexOf('counter.status.' + status + '.api') === 0) {
              this.metricsHttp[status] = this.metricsHttp[status] + this.metrics[name];
              this.metricsHttp['all'] = this.metricsHttp['all'] + this.metrics[name];
            }
          }
        } else if (name.indexOf(packageName) === 0) {
          let serviceName;
          if (name.indexOf('count') > 0) {
            serviceName = name.substring(0, name.indexOf('count') - 1);
            if (!this.metricsServices[serviceName]) {
              this.metricsServices[serviceName] = {};
            }
            this.metricsServices[serviceName].count = this.metrics[name];
          } else if (name.indexOf('snapshot') > 0) {
            serviceName = name.substring(0, name.indexOf('snapshot') - 1);
            if (!this.metricsServices[serviceName]) {
              this.metricsServices[serviceName] = {};
            }
            let type = name.substring(name.indexOf('snapshot') + 'snapshot'.length + 1);
            this.metricsServices[serviceName][type] = this.metrics[name];
          }
        }
      }
      this.metricsServicesArray = [];
      for (let service in this.metricsServices) {
        let entry = {name: service};
        for (let key in this.metricsServices[service]) {
          entry[key] = this.metricsServices[service][key];
        }
        this.metricsServicesArray.push(entry);
      }
      this.metricsServicesArray.sort(this.nameSortFunction);


      this.threads = {};
      this.threadsLabels = [];
      this.threadsData = [];

      this.threads['all'] = 0;
      for (let j in this.dumps) {
        let state = this.dumps[j].threadState;
        if (!this.threads[state]) {
          this.threads[state] = 0;
        }
        this.threads[state]++;
        this.threads['all']++;
      }
      for (let t in this.threads) {
        if (t !== 'all') {
          this.threadsLabels.push(t.substring(0, 1) + t.toLowerCase().substring(1, t.length).replace("_", " "));
          this.threadsData.push(this.threads[t]);
        }
      }

      this.graphs = {};
      this.graphsArray = [];

      for (let k in this.timers) {
        let measure = this.timers[k].name;
        if (!this.graphs[measure]) {
          this.graphs[measure] = {};
          this.graphs[measure].labels = [];
          this.graphs[measure].data = [];
          this.graphs[measure].options = {
            title: {display: true, text: measure},
            legend: {display: true, position: 'bottom'}
          };
          this.graphs[measure].data[0] = [];
          this.graphs[measure].data[1] = [];
          this.graphs[measure].data[2] = [];
        }
        this.graphs[measure].labels.push(this.date.transform(this.timers[k].time, 'yyyy-MM-dd HH-mm-ss'));
        this.graphs[measure].data[0].push(this.timers[k].mean);
        this.graphs[measure].data[1].push(this.timers[k].min);
        this.graphs[measure].data[2].push(this.timers[k].max);
      }

      for (let m in this.graphs) {

        this.graphsArray.push({
          name: m,
          labels: this.graphs[m].labels,
          data: [
            {label: 'Mean', data: this.graphs[m].data[0]},
            {label: 'Min', data: this.graphs[m].data[1]},
            {label: 'Max', data: this.graphs[m].data[2]}
          ]
        });
      }
      this.graphsArray.sort(this.nameSortFunction);

      this.isDataAvailable = true;
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
    this.fontColor = this.getHexColor(window.getComputedStyle(this.textColor.nativeElement).color);
    this.refresh(true);
  }
}
