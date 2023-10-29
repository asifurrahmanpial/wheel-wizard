import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './pages/camera/camera.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MapComponent } from './pages/map/map.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'camera',
		component: CameraComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'map',
		component: MapComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{ path: 'registration', component: RegistrationComponent },
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [() => inject(AuthService).shouldLogIn()]
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
