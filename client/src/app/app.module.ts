import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraComponent } from './pages/camera/camera.component';
import { MapComponent } from './pages/map/map.component';

@NgModule({
	declarations: [AppComponent, CameraComponent, MapComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		CommonModule,
		IonicModule.forRoot()
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
