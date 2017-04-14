import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home.component";
import {LoginComponent} from "./components/login.component";
import {ContactComponent} from "./components/contact.component";
import {HealthComponent} from "./components/health.component";
import {MetricsComponent} from "./components/metrics.component";
import {LoggersComponent} from "./components/loggers.component";
import {UserComponent} from "./components/user.component";
import {CustoComponent} from "./components/custo.component";
import {ActuatorActivation, AdminActivation, AuthenticatedActivation} from "./services/auth-routing.service";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'health', component: HealthComponent, canActivate: [AuthenticatedActivation]},
  {path: 'metrics', component: MetricsComponent, canActivate: [ActuatorActivation]},
  {path: 'loggers', component: LoggersComponent, canActivate: [ActuatorActivation]},
  {path: 'user', component: UserComponent, canActivate: [AuthenticatedActivation]},
  {path: 'custo', component: CustoComponent, canActivate: [AdminActivation]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
