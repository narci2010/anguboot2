import {AfterViewChecked, Component, Directive, HostListener, Input, OnInit, ViewChild} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Directive({selector: '[my-raw]'})
export class RawDirective {
  @Input() rawTitle: string;
  @Input() rawBody: any;

  constructor(private modalService: NgbModal) {
  }

  @HostListener('click', ['$event'])
  open(event: Event) {
    event.preventDefault();
    const modalRef = this.modalService.open(RawModalContent, {size: 'lg'});
    modalRef.componentInstance.title = this.rawTitle;
    modalRef.componentInstance.raw = JSON.stringify(this.rawBody, null, 2);
  }
}


@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
        <ace-editor #editor
        [mode]="'json'"
        [theme]="'tomorrow_night_eighties'"
        [readOnly]="true"
        [options]="options"
        [(text)]="raw">
        </ace-editor>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary pointer" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class RawModalContent implements OnInit, AfterViewChecked {
  @ViewChild('editor') editor: any;
  @Input() title: string;
  @Input() raw: any;
  public options: any = {};

  constructor(public activeModal: NgbActiveModal) {
  }

  public editorInitialized: boolean = false;

  ngOnInit(): void {
    this.editor.getEditor().$blockScrolling = Infinity;
  }

  ngAfterViewChecked() {
    if (!this.editorInitialized) {
      this.editor.getEditor().selection.clearSelection();
      this.editor.getEditor().selection.moveCursorFileStart();
      this.editorInitialized = true;
    }
  }
}



