import {Injectable, Inject, Component, TRANSLATIONS} from '@angular/core';
import {I18NHtmlParser, HtmlParser, Xliff} from '@angular/compiler';
import {LoggerService, Log} from "./logger.service";

@Component({
    selector: 'tmp-i18n-component',
    template: `
    <span hidden i18n="Notification error for status : 500@@ERROR.HTTP_STATUS.500">Internal error from server</span>
    <span hidden i18n="Notification error for status : 401@@ERROR.HTTP_STATUS.401">Not authenticated</span>
    <span hidden i18n="Notification error for status : 403@@ERROR.HTTP_STATUS.403">Access denied</span>
    <span hidden i18n="Notification error for status : 404@@ERROR.HTTP_STATUS.404">Resource not found</span>
    <span hidden i18n="Notification error for status : 404 with resource name@@ERROR.HTTP_STATUS.404.WITH_INTERPOLATION">Resource not found : {{}}</span>
    <span hidden i18n="Notification error for status : 409@@ERROR.HTTP_STATUS.409">Resource already exists</span>
    <span hidden i18n="Notification error for status : 409 with resource name@@ERROR.HTTP_STATUS.409.WITH_INTERPOLATION">Resource already exists : {{}}</span>

    <span hidden i18n="Success state translation@@STATE.SUCCESS">Success</span>
    <span hidden i18n="Warning state translation@@STATE.WARNING">Warning</span>
    <span hidden i18n="Error state translation|Interpolation is error message@@STATE.ERROR">Error : {{errorMessage}}</span>`
})
export class TmpI18nComponent {
}

// - usage in ts:
// this.i18n.get('STATE.SUCCESS');
// this.i18n.get('STATE.ERROR', ['reason']);
// - usage in html:
// {{'STATE.SUCCESS' | translate}}
// {{'STATE.ERROR' | translate:['reason']}}

@Injectable()
export class I18nService {

    private logger: Log;
    private _source: string;
    private _translations: {[name: string]: any};

    constructor(@Inject(TRANSLATIONS) source: string, private loggerService: LoggerService) {
        let xliff = new Xliff();
        this._source = source;
        const loaded = xliff.load(this._source, '');
        this._translations = loaded['i18nNodesByMsgId'] ? loaded['i18nNodesByMsgId'] : {};
        this.logger = loggerService.getLogger('service.i18n');
    }

    get(key: string, interpolation: any[] = []) {
        if(!this._translations[key]){
            this.logger.error('Cannot find i18n for key : ' + key);
            return key;
        }
        let parser = new I18NHtmlParser(new HtmlParser(), this._source);
        let placeholders = this._getPlaceholders(this._translations[key]);
        let parseTree = parser.parse(`<div i18n="@@${key}">content ${this._wrapPlaceholders(placeholders).join(' ')}</div>`, 'someI18NUrl');
        return this._interpolate(parseTree.rootNodes[0]['children'][0].value, this._interpolationWithName(placeholders, interpolation));
    }

    getHttpStatusErrorMessage(code: number, interpolation?: any){
        let key = 'ERROR.HTTP_STATUS.' + code;
        let interpolationArray: any[] = [];
        if(interpolation){
            key += '.WITH_INTERPOLATION';
            interpolationArray.push(interpolation);
        }
        return this.get(key, interpolationArray);
    }

    private _getPlaceholders(nodes: any[]): string[] {
        return nodes.filter((node) => node.hasOwnProperty('name')).map((node) => `${node.name}`);
    }

    private _wrapPlaceholders(placeholders: string[]): string[] {
        return placeholders.map((node) => `{{${node}}}`);
    }

    private _interpolationWithName(placeholders: string[], interpolation: any[]): {[name: string]: any} {
        let asObj = {};
        placeholders.forEach((name, index) => {
            asObj[name] = interpolation[index];
        });
        return asObj;
    }

    private _interpolate(pattern: string, interpolation: {[name: string]: any}) {
        let compiled = '';
        compiled += pattern.replace(/{{(\w+)}}/g, function (match, key) {
            if (interpolation[key] && typeof interpolation[key] === 'string') {
                match = match.replace(`{{${key}}}`, interpolation[key]);
            }
            return match;
        });
        return compiled;
    }
}