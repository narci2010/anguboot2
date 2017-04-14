import {Component, Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Directive({selector: '[my-confirm]'})
export class ConfirmDirective {
  @Input() confirmTitle: string;
  @Input() confirmMessage: string;
  @Output() onConfirm: EventEmitter<any> = new EventEmitter();
  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal) {
  }

  @HostListener('click', ['$event'])
  open(event: Event) {
    event.preventDefault();
    const modalRef = this.modalService.open(ConfirmModalContent, {size: 'lg'});
    modalRef.componentInstance.title = this.confirmTitle;
    modalRef.componentInstance.message = this.confirmMessage;
    modalRef.result.then(() => this.onConfirm.emit(), () => this.onCancel.emit());
  }
}


@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
        <span>{{message}}</span>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary pointer" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary pointer" (click)="activeModal.close()">Confirm</button>
    </div>
  `
})
export class ConfirmModalContent {
  @Input() title: string;
  @Input() message: any;

  constructor(public activeModal: NgbActiveModal) {
  }
}



