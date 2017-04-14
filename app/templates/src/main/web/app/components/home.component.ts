import {Component, OnInit} from "@angular/core";

import {UserService} from "../services/user.service";


@Component({
  templateUrl: './home.component.html'

})
export class HomeComponent implements OnInit {

  title: string;
  showSignIn: boolean = true;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getTitle().subscribe(title => {
      this.title = title;
      this.showSignIn = false;
    });
  }
}
