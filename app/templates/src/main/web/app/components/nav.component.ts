import {Component, OnInit} from "@angular/core";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isArray} from "util";
import {User} from "../beans/user";
import {Constants} from "../constants";
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

  private isNavbarCollapsed: boolean = true;
  private authenticated: boolean = false;
  private admin: boolean = false;
  private actuator: boolean = false;
  private env: string;
  private current: string;

  private locales: any[] = [{locale:'en', translation: 'English'}, {locale:'fr', translation: 'Français'}, {locale:'es', translation: 'Espanol'}];

  constructor(private userService: UserService, private router: Router, private constants: Constants, private route: ActivatedRoute, private cookie: CookieService) {
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
  }

  public logout(): void {
    this.userService.logout().subscribe(() => {
      this.authenticated = false;
      this.admin = false;
      this.actuator = false;
      this.router.navigate(['/login']);
    });
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
  }

  public changeLocale(locale: string): void {
    if(!this.current || locale !== this.current){
        this.cookie.put('ANGUTEST2-LOCALE', locale);
        location.reload();
    }
  }

  ngOnInit(): void {
    this.current = this.cookie.get('ANGUTEST2-LOCALE');
    this.refresh();
    this.route.queryParams.subscribe(params => {
        if(params['authentication']){
            this.refresh();
        }
    });
  }
}


