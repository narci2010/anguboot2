import {Component, OnInit} from "@angular/core";

import {SpringService} from "../services/spring.service";

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title: string;<% if (plugins.security) { %>
  showSignIn: boolean = true;<%}%>

  constructor(private spring: SpringService) {
  }

  ngOnInit(): void {
    this.spring.getTitle().subscribe(title => {
      this.title = title;<% if (plugins.security) { %>
      this.showSignIn = false;<%}%>
    });
  }
}
