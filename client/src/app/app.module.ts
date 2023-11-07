import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraComponent } from './pages/camera/camera.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MapComponent } from './pages/map/map.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { RidesComponent } from './pages/rides/rides.component';
import { BookRideComponent } from './pages/book-ride/book-ride.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RideSummaryComponent } from './pages/ride-summary/ride-summary.component';
import { StripeComponent } from './pages/stripe/stripe.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@NgModule({
	declarations: [
		AppComponent,
		CameraComponent,
		MapComponent,
		HomeComponent,
		LoginComponent,
		RegistrationComponent,
		ProfileComponent,
		RidesComponent,
		QrScannerComponent,
		BookRideComponent,
		RideSummaryComponent,
		StripeComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		CommonModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatToolbarModule,
		MatSidenavModule,
		MatButtonModule,
		MatIconModule,
		MatDividerModule,
		MatCheckboxModule,
		MatCardModule,
		MatListModule,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot()
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
