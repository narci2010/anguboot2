import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ActuatorService, Counter} from "../services/actuator.service";
import {SpinnerService} from "../services/spinner.service";
import {NotificationService, NotificationType} from "../services/notification.service";
import {Dump} from "../beans/dump";

@Component({
  templateUrl: './dump.component.html'
})
export class DumpComponent implements OnInit {
  @ViewChild("textColorDump") textColor:ElementRef;

  private dumps: Dump[];

  private threads = {};
  private threadStates: string[] = [];
  private threadsData: number[] = [];
  private threadsLabels: string[] = [];
  private threadsOptions: any;
  
  private isDataAvailable: boolean = false;

  private fontColor: string;

  private term: string;
  private termState: string;

  private filteredCount: Counter = new Counter();

  public resetFilters(): void {
    this.term = '';
    this.termState = undefined;
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

  public getClass(state: string, test = true) {
    if (!test) {
      return 'badge-default';
    }
    switch (state) {
      case 'RUNNABLE':
        return 'badge-success';
      case 'WAITING':
        return 'badge-info';
      case 'TIMED_WAITING':
        return 'badge-info';
      case 'NEW':
        return 'badge-warning';
      case 'BLOCKED':
        return 'badge-danger';
      case 'TERMINATED':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  }

  constructor(private service: ActuatorService, private spinner: SpinnerService, private notification: NotificationService) {
  }

  private refresh(skipNotification: boolean) {
    this.dumps = [];

    this.resetFilters();

    this.threadsOptions = {
      legend: {
        position: 'bottom',
        labels: {
          fontColor: this.fontColor
        }
      }
    };

    this.spinner.start();
    this.service.dump().subscribe(value => {
      this.dumps = value;

      this.threads = {};
      this.threadsLabels = [];
      this.threadsData = [];

      this.threads['all'] = 0;
      for (let j in this.dumps) {
        let state = this.dumps[j].threadState;
        if (!this.threads[state]) {
          this.threads[state] = 0;
          this.threadStates.push(state);
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

      if (!skipNotification) {
        this.notification.notify(NotificationType.SUCCESS, 'Dashboard refreshed');
      }
      this.filteredCount.count = this.dumps.length;
      this.isDataAvailable = true;
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
