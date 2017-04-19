import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home.component";
import {ContactComponent} from "./components/contact.component";
import {HealthComponent} from "./components/health.component";
import {DumpComponent} from "./components/dump.component";
import {TraceComponent} from "./components/trace.component";
import {AuditComponent} from "./components/audit.component";
import {BeansComponent} from "./components/beans.component";
import {EnvComponent} from "./components/env.component";
import {MappingsComponent} from "./components/mappings.component";
import {MetricsComponent} from "./components/metrics.component";
import {LoggersComponent} from "./components/loggers.component";<% if(plugins.security) { %>
import {LoginComponent} from "./components/login.component";
import {UserComponent} from "./components/user.component";<% } %><% if(plugins.custo) { %>
import {CustoComponent} from "./components/custo.component";<% } %><% if(plugins.security) { %>
import {ActuatorActivation, AdminActivation, AuthenticatedActivation} from "./services/auth-routing.service";<% } %>

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},<% if(plugins.security) { %>
  {path: 'login', component: LoginComponent},<% } %>
  {path: 'contact', component: ContactComponent},
  {path: 'health', component: HealthComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},
  {path: 'dump', component: DumpComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},
  {path: 'trace', component: TraceComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},
  {path: 'env', component: EnvComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},
  {path: 'auditevents', component: AuditComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},
  {path: 'beans', component: BeansComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},
  {path: 'mappings', component: MappingsComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},
  {path: 'metrics', component: MetricsComponent<% if(plugins.security) { %>, canActivate: [ActuatorActivation]<% } %>},
  {path: 'loggers', component: LoggersComponent<% if(plugins.security) { %>, canActivate: [ActuatorActivation]<% } %>},<% if(plugins.security) { %>
  {path: 'user', component: UserComponent<% if(plugins.security) { %>, canActivate: [AuthenticatedActivation]<% } %>},<% } %><% if(plugins.custo) { %>
  {path: 'custo', component: CustoComponent<% if(plugins.security) { %>, canActivate: [AdminActivation]<% } %>},<% } %>
  {path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
