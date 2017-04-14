import {DOCUMENT, DomSanitizer} from "@angular/platform-browser";
import {AfterViewChecked, Component, Inject, OnInit, ViewChild} from "@angular/core";
import {NotificationService, NotificationType} from "../services/notification.service";
import {SpinnerService} from "../services/spinner.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CustoService} from "../services/custo.service";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";
import {NavigationStart, Router} from "@angular/router";

declare let Sass: any;

export class Color {
  name: string;
  value: string;
}

@Component({
  templateUrl: './custo.component.html'
})
export class CustoComponent implements OnInit {

  @ViewChild('custoForm') custoForm: NgForm;

  private isNavbarCollapsed: boolean = true;
  private custo: any = {};
  private fileNames: string = null;

  private buttonTypes: string[] = ['default', 'primary', 'secondary', 'success', 'info', 'warning', 'danger'];
  private badgeTypes: string[] = ['default', 'primary', 'success', 'info', 'warning', 'danger'];
  private alertTypes: string[] = ['success', 'info', 'warning', 'danger'];

  private page: number = 3;
  private pageSize: number = 10;

  private raw: any = {
    'property1': 'value1',
    'array1': [{'otherProperty1': 'otherValue1', 'otherProperty2': 'otherValue2'}]
  };

  private sass: any;

  private dark: any;
  private light: any;
  private styles: any;
  private bootstrap: any;
  private bootstrapMixinsNoImport: string;

  private fileUrl: any;

  private concatenation: string;

  private theme: string = 'dark';

  private colors: Color[];
  private themeNoColor: string;
  private ready: boolean = false;

  constructor(private service: CustoService, private notification: NotificationService, private spinner: SpinnerService, private modalService: NgbModal,
                private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document: any, private router: Router) {
  }

  public notify(type: string): void {
    let notifType = NotificationType[type.toUpperCase()];
    if (type === 'danger') {
      notifType = NotificationType.ERROR;
    }
    this.notification.notify(notifType, 'Type: ' + type, 'Message example');
  }

  public showSpinner(): void {
    this.spinner.start();
    setTimeout(() => this.spinner.stop(), 2000);
  }

  public aceModal(): void {
    this.modalService.open(AceModalContent, {size: 'lg'});
  }

  public file(event: any): void {
    let fileNamesArray: string [] = [];
    for (let file of event.target.files) {
      fileNamesArray.push(file.name);
    }
    this.fileNames = fileNamesArray.join(", ");
  }

  public changeTheme(): void {
    this.spinner.start();
    let linesColors;
    this.fileUrl = undefined;
    switch (this.theme) {
      case 'dark':
        linesColors = this.dark.split('\n');
        break;
      case 'light':
        linesColors = this.light.split('\n');
        break;
    }

    this.colors = [];
    this.themeNoColor = '';
    for (let i in linesColors) {
      let l = linesColors[i];
      if (l.indexOf('$my-') === 0) {
        let name = l.substring(0, l.indexOf(':'));
        let start = l.indexOf('#') > -1 ? l.lastIndexOf('#') : l.lastIndexOf('rgb');
        let value = l.substring(start, l.indexOf(';'));
        if (name && value) {
          let color = new Color();
          color.name = name;
          color.value = value;
          this.colors.push(color);
        }
      } else if(l.indexOf('//') !== 0){
        // not a color -> to keep
        this.themeNoColor += l + '\n';
      }
    }
    this.spinner.stop();
  }

  public compile(): void {
    this.spinner.start();
    console.debug('Compiling SCSS');

    // get colors
    let theme = '';
    for(let color of this.colors){
        theme += color.name + ': ' + color.value + ';\n';
    }
    theme += this.themeNoColor;

    // set theme in sass
    this.sass.removeFile('theme');
    this.sass.writeFile('theme', theme);

    // compile
    this.sass.compile(this.styles, (result: any) => {
      if(result.status === 0){
        console.debug('Result : ', result);
        var blob = new Blob([result.text], { type: 'text/plain' });
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        this.notification.notify(NotificationType.SUCCESS, 'Successfully compiled');
        // insert style
        let head = this.document.getElementsByTagName('head')[0];
        let newStyle = this.document.getElementById('customization');
        if(!newStyle){
            let style = this.document.getElementsByTagName('style')[0];
            newStyle = style.cloneNode(false);
            newStyle.id = 'customization';
        }
        newStyle.innerHTML = result.text;
        head.append(newStyle);
      } else {
        console.error('Error during SCSS compilation : ', result);
        this.notification.notify(NotificationType.ERROR, 'Bad SCSS status ' + result.status + ' : ' + result.message);
      }
      this.spinner.stop();
    });
  }

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if(event instanceof NavigationStart) {
                if(this.document.getElementById('customization')){
                    this.document.getElementById('customization').remove();
                }
            }
        });

        let observables: Observable<any>[] = [];

        this.spinner.start();

        observables.push(this.service.download('scss/theme.scss'));
        observables.push(this.service.download('scss/theme-light.scss'));
        observables.push(this.service.download('scss/styles.scss'));
        observables.push(this.service.download('scss/bootstrap/bootstrap.scss'));
        observables.push(this.service.download('scss/bootstrap/_mixins.scss'));
        observables.push(this.service.download('scss/bootstrap/_utilities.scss'));
        // TODO scssize it
        //observables.push(this.service.download('styles/spinner.css'));

        Observable.forkJoin(observables).subscribe(result => {
          this.dark = result[0];
          this.light = result[1];
          this.styles = result[2];
          this.bootstrap = result[3];
          let bootstrapMixins = result[4];
          let bootstrapUtilities = result[5];

        // prepare Sass
        this.sass = new Sass();

        let files: string[] = [];

        for(let line of this.bootstrap.split('\n')){
            if(line.indexOf('@import') > -1) {
                if(line.indexOf('@import "mixins"') > -1){
                    this.bootstrapMixinsNoImport = '';
                    for(let line of bootstrapMixins.split('\n')){
                        if(line.indexOf('@import') > -1) {
                            files.push('bootstrap/'+(line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'))+'.scss').replace('/', '/_'));
                        } else {
                            this.bootstrapMixinsNoImport += line + '\n';
                        }
                    }
                } else if(line.indexOf('@import "utilities"') > -1){
                    for(let line of bootstrapUtilities.split('\n')){
                        if(line.indexOf('@import') > -1) {
                            files.push('bootstrap/'+(line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'))+'.scss').replace('/', '/_'));
                        }
                    }
                } else {
                    files.push('bootstrap/_'+line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'))+'.scss');
                }
            }
        }

        let downloads: Observable<any>[] = [];

        for(let file of files){
            downloads.push(this.service.download('scss/' + file));
        }

        Observable.forkJoin(downloads).subscribe(result => {
            this.concatenation = '';
            this.concatenation += this.bootstrapMixinsNoImport;
            for(let index in result){
                if(result[index]){
                    this.concatenation += result[index];
                }
            }
            this.sass.writeFile('~bootstrap/scss/bootstrap', this.concatenation);
            // we do not need font awesome to build new css as it will be included in standard one
            this.sass.writeFile('~font-awesome/scss/font-awesome', '');
            this.sass.writeFile('~angular2-toaster/toaster', '');
            this.sass.writeFile('../css/spinner', '');

            this.changeTheme();
            this.spinner.stop();
            this.ready = true;
        }, error => {
          console.error(error);
          //this.notification.notifyHttpError(error);
          this.notification.notify(NotificationType.ERROR, 'Unable to initialize customization');
          this.spinner.stop();
        });

        }, error => {
          console.error(error);
          //this.notification.notifyHttpError(error);
          this.notification.notify(NotificationType.ERROR, 'Unable to initialize customization');
          this.spinner.stop();
        });
  }

}

@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
        <h4 class="modal-title">Editor example</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <div>
            <h5>Editor:</h5>
            <hr/>
            <ace-editor #editor
                        [mode]="mode"
                        [theme]="theme"
                        [readOnly]="readOnly"
                        [(text)]="model">
            </ace-editor>
        </div>
        <hr/>
        <div>
            <h5>Options:</h5>
            <hr/>
            <form #aceForm="ngForm" class="form-inline row">
                <div class="col-md-6 form-group">
                    <label class="mr-sm-2" for="theme">Theme</label>
                    <select id="theme" name="theme" class="form-control" [(ngModel)]="theme">
                        <option *ngFor="let theme of themes" [value]="theme">{{theme}}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label class="mr-sm-2" for="mode">Mode</label>
                    <select id="mode" name="mode" class="form-control" [(ngModel)]="mode" (change)="modeChange()">
                        <option *ngFor="let mode of modes" [value]="mode">{{mode}}</option>
                    </select>
                </div>
                <div class="col-md-2 form-check">
                    <label for="readOnly" class="custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0">
                        <input id="readOnly" name="readOnly" type="checkbox" class="custom-control-input" [(ngModel)]="readOnly">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Read only</span>
                    </label>
                </div>
            </form>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class AceModalContent implements AfterViewChecked {
  @ViewChild('editor') editor: any;

  mode: string = 'java';
  theme: string = 'tomorrow_night_eighties';

  modes: string[] = ['asciidoc', 'markdown', 'java', 'css', 'json', 'properties', 'html', 'yaml', 'sql', 'xml', 'javascript'];
  themes: string[] = ['vibrant_ink', 'twilight', 'tomorrow_night_eighties', 'terminal', 'eclipse', 'chrome'];

  model: string = 'package io.fonimus;\n\npublic class MyClass {\n\n\tpublic static void main(String[] args) {\n\t\t// ...\n\t}\n\n}';
  models: any = {
    xml: '<element attr="name">\n\t<sub />\n</element>',
    javascript: 'var test = function() {\n\t...\n};',
    asciidoc: '= Title\n\nDescription...\n\n== Chapter',
    markdown: '# Title\n\n> Description...\n\n## Chapter',
    css: '.class {\n\ttext-align: left;\n}',
    json: '{"property": "value"}',
    properties: '# Properties\nproperty1=value1\nproperty2=value2',
    html: '<div>\n\t<p>My text</p>\n</div>',
    yaml: '# Properties\nproperty:\n\tsub:\n\t\tsub-sub: value',
    sql: 'insert into `table` values (1, 2, 3);',
    java: 'package io.fonimus;\n\npublic class MyClass {\n\n\tpublic static void main(String[] args) {\n\t\t// ...\n\t}\n\n}'
  };

  constructor(public activeModal: NgbActiveModal) {
  }

  public modeChange(): void {
    this.editor.getEditor().setValue(this.models[this.mode.toLocaleLowerCase()]);
    this.editor.getEditor().selection.clearSelection();
    this.editor.getEditor().selection.moveCursorFileStart();
  }

  public editorInitialized: boolean = false;

  ngAfterViewChecked() {
    if (!this.editorInitialized) {
      this.editor.getEditor().setValue(this.models[this.mode.toLocaleLowerCase()]);
      this.editor.getEditor().$blockScrolling = Infinity;
      this.editor.getEditor().selection.clearSelection();
      this.editor.getEditor().selection.moveCursorFileStart();
      this.editorInitialized = true;
    }
  }
}
