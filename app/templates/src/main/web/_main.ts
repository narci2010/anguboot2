import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";<% if (plugins.translate) { %>
import {getTranslationProviders} from "./app/i18n-providers";<%}%>

import {AppModule} from "./app/app.module";

if (process.env.ENV === 'production') {
  enableProdMode();
}<% if (!plugins.translate) { %>

platformBrowserDynamic().bootstrapModule(AppModule);<%} else { %>

getTranslationProviders().then(providers => {
  const options = {providers};
  platformBrowserDynamic().bootstrapModule(AppModule, options);
});<%}%>