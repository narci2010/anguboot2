import {Component, OnInit} from "@angular/core";
import {UserService} from "../services/user.service";
import {User} from "../beans/user";


@Component({
  templateUrl: './user.component.html'

})
export class UserComponent implements OnInit {

  user: User;

  constructor(private service: UserService) {
  }

  ngOnInit(): void {
    this.service.me().then(user => {
      this.user = user;
    });
  }
}
