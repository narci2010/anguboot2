import {Component, Inject} from "@angular/core";
import {SpinnerService} from "./services/spinner.service";
import {ToasterConfig} from "angular2-toaster";
import {Constants} from "./constants";
import {LoggerService} from "./services/logger.service";
import {DOCUMENT} from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  template: `
  <toaster-container [toasterconfig]="toasterConfig"></toaster-container>
  <my-spinner *ngIf="status" class="spinner-overall"><p>&nbsp;</p></my-spinner>
  <my-nav></my-nav>
  <div class="container-fluid container-fixed">
    <router-outlet></router-outlet> 
  </div>
  <footer class="fixed-bottom bg-faded text-center">
    <p>
        <span>© Copyright my company</span>
        <span *ngIf="version">| v{{constants.version}}</span>
        <span *ngIf="env == 'dev'">| Development version</span>
    </p>
  </footer>
 `,

})
export class AppComponent {

  status: boolean;
  version: number;
  env: string;

  constructor(@Inject(DOCUMENT) private document: any, private spinner: SpinnerService, private constants: Constants, private loggerService: LoggerService) {
    this.status = false;
    this.version = constants.version;
    this.env = constants.env;
    this.loggerService.getLogger('app').debug('Application started, constants : ', constants);
  }

  public toasterConfig : ToasterConfig = new ToasterConfig({
      showCloseButton: false,
      tapToDismiss: true,
      timeout: 5000
  });

  ngOnInit() {
    let head = this.document.getElementsByTagName('head')[0];
    let specific = this.document.getElementById('specific');
    head.append(specific);
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.status = val;
    });
  }

}
