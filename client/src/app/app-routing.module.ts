import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './pages/camera/camera.component';
import { MapComponent } from './pages/map/map.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
	{ path: '', redirectTo: 'map', pathMatch: 'full' },
	{ path: '', component: HomeComponent },
	{ path: 'camera', component: CameraComponent },
	{ path: 'map', component: MapComponent },
	{ path: 'registration', component: RegistrationComponent },
	{ path: 'login', component: LoginComponent }
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
