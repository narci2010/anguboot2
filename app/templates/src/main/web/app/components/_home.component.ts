import {Component, OnInit} from "@angular/core";
import {SpinnerService} from "../services/spinner.service";
import {SpringService} from "../services/spring.service";

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title: string;<% if (plugins.security) { %>
  showSignIn: boolean = true;<%}%>

  constructor(private spring: SpringService, private spinner: SpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.start();
    this.spring.getTitle().subscribe(title => {
      this.title = title;<% if (plugins.security) { %>
      this.showSignIn = false;<%}%>
      this.spinner.stop();
    }, () => this.spinner.stop());
  }
}
