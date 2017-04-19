import {Component, EventEmitter, Input, Output} from "@angular/core";

export enum Direction {
  NONE, ASC, DESC
}

@Component({
    selector: '[my-th-sort]',
    template: `<span class="pointer" (click)="sort()">
        <span>{{headerName}}</span>
        <span class="margin-left" [ngClass]="currentClass"></span>
    </span>`
})
export class TableSortDirective {

  @Input() sortBy: string;
  @Input() headerName: string;
  @Input() sortClass: string = 'fa fa-sort';
  @Input() ascClass: string = 'fa fa-sort-asc';
  @Input() descClass: string = 'fa fa-sort-desc';
  @Input() direction: Direction = Direction.NONE;

  private currentClass: string;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.setCurrentClass();
  }

  private setCurrentClass(){
    switch(this.direction){
        case Direction.ASC:
            this.currentClass = this.ascClass;
            break;
        case Direction.DESC:
            this.currentClass = this.descClass;
            break;
        default:
            this.currentClass = this.sortClass;
            break;
    }
  }

  sort() {
    let sort: string;
    switch(this.direction){
        case Direction.ASC:
            this.direction = Direction.DESC;
            sort = '-' + this.sortBy;
            break;
        case Direction.DESC:
            this.direction = Direction.NONE;
            break;
        default:
            this.direction = Direction.ASC;
            sort = this.sortBy;
            break;
    }
    this.setCurrentClass();
    this.onClick.emit({sort: sort});
  }
}