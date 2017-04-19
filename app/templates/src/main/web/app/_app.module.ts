// angular
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {DatePipe} from "@angular/common";
// application
import {AppRoutingModule} from "./app-routing.module";
// components
import {AppComponent} from "./app.component";
import {NavComponent} from "./components/nav.component";<% if (plugins.security) { %>
import {LoginComponent} from "./components/login.component";<%}%>
import {HomeComponent} from "./components/home.component";
import {MetricsComponent} from "./components/metrics.component";
import {LoggersComponent} from "./components/loggers.component";
import {HealthComponent} from "./components/health.component";
import {DumpComponent} from "./components/dump.component";
import {TraceComponent} from "./components/trace.component";
import {ContactComponent} from "./components/contact.component";<% if (plugins.security) { %>
import {UserComponent} from "./components/user.component";<%}%><% if (plugins.custo) { %>
import {<% if (plugins.ace) { %>AceModalContent, <%}%>CustoComponent} from "./components/custo.component";<%}%>
// services<% if (plugins.security) { %>
import {UserService} from "./services/user.service";<%}%>
import {UtilService} from "./services/util.service";
import {SpringService} from "./services/spring.service";
import {ActuatorService} from "./services/actuator.service";
import {NotificationService} from "./services/notification.service";
import {SpinnerService} from "./services/spinner.service";
import {HttpService} from "./services/http.service";<% if (plugins.security) { %>
import {ActuatorActivation, AdminActivation, AuthenticatedActivation} from "./services/auth-routing.service";<%}%><% if (plugins.custo) { %>
import {CustoService} from "./services/custo.service";<%}%>
import {LoggerService} from "./services/logger.service";<% if (plugins.translate) { %>
import {I18nService, TmpI18nComponent} from "./services/i18n.service";<% } %>
import {Constants} from "./constants";
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {MockService} from "./services/mock.service";
// directives
import {SpinnerComponent} from "./directives/spinner.directive";
import {RawDirective, RawModalContent} from "./directives/raw.directive";
import {ConfirmDirective, ConfirmModalContent} from "./directives/confirm.directive";
import {TableSortDirective} from "./directives/table.directive";
// pipes
import {TimePipe} from "./pipes/time.pipe";
import {SizePipe} from "./pipes/size.pipe";
import {FilterPipe} from "./pipes/filter.pipe";<% if (plugins.translate) { %>
import {TranslatePipe} from "./pipes/translate.pipe";<% } %>
// addons
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ChartsModule} from "ng2-charts";
import "chart.js/dist/Chart.bundle.min.js";
import {ToasterModule} from "angular2-toaster";
import {LocalStorageModule} from "angular-2-local-storage";
import {CookieService} from 'angular2-cookie/services/cookies.service';<% if (plugins.custo) { %>
import {ColorPickerModule} from 'ngx-color-picker';<% } %><% if (plugins.ace) { %>
// ace
import {AceEditorModule} from "ng2-ace-editor";

import "ace-builds/src-min-noconflict/theme-vibrant_ink.js";
import "ace-builds/src-min-noconflict/theme-tomorrow_night_eighties.js";
import "ace-builds/src-min-noconflict/theme-twilight.js";
import "ace-builds/src-min-noconflict/theme-terminal.js";
import "ace-builds/src-min-noconflict/theme-eclipse.js";
import "ace-builds/src-min-noconflict/theme-chrome.js";

import "brace/theme/vibrant_ink.js";
import "brace/theme/tomorrow_night_eighties.js";
import "brace/theme/twilight.js";
import "brace/theme/terminal.js";
import "brace/theme/eclipse.js";
import "brace/theme/chrome.js";

import "ace-builds/src-min-noconflict/mode-json.js";
import "ace-builds/src-min-noconflict/mode-java.js";
import "ace-builds/src-min-noconflict/mode-javascript.js";
import "ace-builds/src-min-noconflict/mode-css.js";
import "ace-builds/src-min-noconflict/mode-xml.js";
import "ace-builds/src-min-noconflict/mode-asciidoc.js";
import "ace-builds/src-min-noconflict/mode-markdown.js";
import "ace-builds/src-min-noconflict/mode-properties.js";
import "ace-builds/src-min-noconflict/mode-html.js";
import "ace-builds/src-min-noconflict/mode-yaml.js";
import "ace-builds/src-min-noconflict/mode-sql.js";

import "brace/mode/json";
import "brace/mode/css";
import "brace/mode/javascript";
import "brace/mode/xml";
import "brace/mode/html";
import "brace/mode/java";

import "brace/worker/json";
import "brace/worker/css";
import "brace/worker/javascript";
import "brace/worker/xml";
import "brace/worker/html";<%}%>
// styles
import "../assets/scss/styles.scss";

import "../assets/images/favicon.ico";

declare let CONSTANTS: any;

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, AppRoutingModule, <% if (plugins.ace) { %>AceEditorModule, <%}%>NgbModule.forRoot(), ChartsModule, ToasterModule,<% if (plugins.custo) { %> ColorPickerModule,<% } %>
  LocalStorageModule.withConfig({prefix: 'angutest', storageType: 'localStorage' }), CONSTANTS.mock_http ? InMemoryWebApiModule.forRoot(MockService, { delay: 500 }) : []],
  entryComponents: [RawModalContent, ConfirmModalContent<% if (plugins.custo && plugins.ace) { %>, AceModalContent<%}%>],
  providers: [<% if (plugins.security) { %>UserService, <%}%>UtilService, SpringService, ActuatorService, NotificationService, SpinnerService, HttpService,<% if (plugins.custo) { %> CustoService, <%}%> LoggerService,
    TimePipe, SizePipe, DatePipe,<% if (plugins.translate) { %> TranslatePipe, I18nService,<% } %><% if (plugins.security) { %>
    AuthenticatedActivation, AdminActivation, ActuatorActivation,<%}%>
    Constants, CookieService],
  bootstrap: [AppComponent],
  declarations: [AppComponent, HomeComponent, ContactComponent, HealthComponent, DumpComponent, TraceComponent, LoggersComponent, MetricsComponent,
    NavComponent, <% if (plugins.security) { %>LoginComponent, <%}%>SpinnerComponent, <% if (plugins.security) { %>UserComponent,<%}%>
    RawModalContent, RawDirective, <% if (plugins.custo) { %> CustoComponent,<% if (plugins.ace) { %>AceModalContent, <%}%><%}%>ConfirmModalContent, ConfirmDirective, TableSortDirective,
    TimePipe, SizePipe, FilterPipe<% if (plugins.translate) { %>, TmpI18nComponent, TranslatePipe<% } %>]
})
export class AppModule {
}
