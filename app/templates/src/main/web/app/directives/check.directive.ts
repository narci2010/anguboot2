import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: '[my-check]',
    template: `<span [ngClass]="currentClass"></span>`
})
export class CheckDirective implements OnInit {

  @Input() ok: any;
  @Input() okClass: string = 'fa fa-check';
  @Input() koClass: string = 'fa fa-times';
  private currentClass: string;

  ngOnInit(): void {
    this.currentClass = this.ok ? this.okClass : this.koClass;
  }
}