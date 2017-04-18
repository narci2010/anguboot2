import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode<% if(plugins.translate) { %>, Provider<% } %>} from "@angular/core";<% if (plugins.translate) { %>
import {getTranslationProviders} from "./app/i18n-providers";<%}%>

import {AppModule} from "./app/app.module";

declare let CONSTANTS: any;

if (CONSTANTS.env === 'production') {
  enableProdMode();
}<% if (!plugins.translate) { %>

platformBrowserDynamic().bootstrapModule(AppModule);<%} else { %>

getTranslationProviders().then(providers => {
  const options = {providers};
  platformBrowserDynamic(<Provider[]>options.providers).bootstrapModule(AppModule, options);
});<%}%>
