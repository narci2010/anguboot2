import {LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT} from '@angular/core'
import {LocalStorageService} from 'angular-2-local-storage'

declare var System: any;

export function getTranslationProviders(): Promise<Object[]> {

  const locale = getCookie('ANGUTEST2-LOCALE') || localStorage.getItem('locale') || navigator.language || document['locale'] as string || 'en';

  const noProviders: Object[] = [];

  if (!locale || locale === 'en') {
    return Promise.resolve(noProviders);
  }

  return getTranslations(locale).then((translations: string) => [
      {provide: TRANSLATIONS, useValue: translations},
      {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
      {provide: LOCALE_ID, useValue: locale}
    ]).catch(() => noProviders);

  function getTranslations(locale: string) {
    return System.import('../locale/messages.' + locale + '.xlf');
  }

  function getCookie(name: string) {
       let ca: Array<string> = document.cookie.split(';');
       let caLen: number = ca.length;
       let cookieName = `${name}=`;
       let c: string;

       for (let i: number = 0; i < caLen; i += 1) {
           c = ca[i].replace(/^\s+/g, '');
           if (c.indexOf(cookieName) == 0) {
               return c.substring(cookieName.length, c.length);
           }
       }
       return undefined;
   }
}
