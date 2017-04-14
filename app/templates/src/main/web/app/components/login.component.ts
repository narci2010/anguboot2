import {Component, OnInit} from "@angular/core";

import {Router} from "@angular/router";
import {Credentials} from "../beans/user";
import {UserService} from "../services/user.service";
import {NotificationService, NotificationType} from "../services/notification.service";

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  private credentials = new Credentials;

  constructor(private userService: UserService, private router: Router, private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.userService.authenticated().then(authenticated => {
        if(authenticated) {
          this.router.navigate(['/home']);
        }
    });
  }

  login() {
    this.userService.login(this.credentials).subscribe(user => {
      this.notification.notify(NotificationType.SUCCESS, 'Welcome', user.name);
      this.router.navigate(['/home'], { queryParams: { authentication: 'success' } });
    }, error => this.notification.notifyHttpError(error));
  }

}
