import {Component, OnInit} from "@angular/core";<% if(plugins.security) { %>
import {UserService} from "../services/user.service";
import {User} from "../beans/user";<% } %>
import {ActivatedRoute, Router} from "@angular/router";
import {SpinnerService} from "../services/spinner.service";
import {isArray} from "util";
import {Constants} from "../constants";<% if (plugins.translate) { %>
import {CookieService} from 'angular2-cookie/core';<%}%>

@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

  private isNavbarCollapsed: boolean = true;<% if(plugins.security) { %>
  private authenticated: boolean = false;
  private admin: boolean = false;
  private actuator: boolean = false;<%}%>
  private env: string;<% if (plugins.translate) { %>
  private current: string;

  private locales: any[] = <%-localesForNavComponent%>;<%}%>

  constructor(<% if(plugins.security) { %>private userService: UserService, <% } %>private router: Router, private spinner: SpinnerService, private constants: Constants, private route: ActivatedRoute<% if (plugins.translate) { %>, private cookie: CookieService<%}%>) {
    this.env = constants.env;
  }

  public active(urlObject: string | string[]): boolean {
    if (urlObject instanceof String) {
      return this.router.isActive(urlObject, false);
    } else if (isArray(urlObject)) {
      for (let u in urlObject) {
        if (this.router.isActive(urlObject[u], false)) {
          return true;
        }
      }
    }
    return false;
  }<% if(plugins.security) { %>

  public logout(): void {
    this.spinner.start();
    this.userService.logout().subscribe(() => {
      this.authenticated = false;
      this.admin = false;
      this.actuator = false;
      this.router.navigate(['/login']);
      this.spinner.stop();
    }, () => this.spinner.stop());
  }

  public refresh(): void {
    this.userService.me().then(user => {
      this.authenticated = true;
      this.admin = this.hasRole(user, 'ROLE_ADMIN');
      this.actuator = this.hasRole(user, 'ROLE_ACTUATOR');
    }).catch(() => {});
  }

  public hasRole(user: User, role: string): boolean {
    for (let index in user.authorities) {
      if (user.authorities[index].authority === role) {
        return true;
      }
    }
    return false;
  }<% } %><% if (plugins.translate) { %>

  public changeLocale(locale: string): void {
    if(!this.current || locale !== this.current){
        this.cookie.put('ANGUTEST2-LOCALE', locale);
        location.reload();
    }
  }<%}%>

  ngOnInit(): void {<% if (plugins.translate) { %>
    this.current = this.cookie.get('ANGUTEST2-LOCALE');<%}%><% if(plugins.security) { %>
    this.refresh();
    this.route.queryParams.subscribe(params => {
        if(params['authentication']){
            this.refresh();
        }
    });<% } %>
  }
}


