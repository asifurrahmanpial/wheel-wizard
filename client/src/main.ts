import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { defineCustomElements } from 'stripe-pwa-elements/loader';
import '@angular/compiler';

if (environment.production) {
	enableProdMode();
	window.console.log = () => {};
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.then(() => defineCustomElements(window))
	.catch((err) => console.error(err));

defineCustomElements(window);
if (environment.production) {
	enableProdMode();
}
