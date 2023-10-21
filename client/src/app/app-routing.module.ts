import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './pages/camera/camera.component';
import { MapComponent } from './pages/map/map.component';

const routes: Routes = [
	// { path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '', redirectTo: 'map', pathMatch: 'full' },
	{ path: 'camera', component: CameraComponent },
	{ path: 'map', component: MapComponent }
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
