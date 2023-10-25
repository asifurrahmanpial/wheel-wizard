import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './pages/camera/camera.component';
import { MapComponent } from './pages/map/map.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
	{ path: '', redirectTo: 'map', pathMatch: 'full' },
	{ path: '', component: HomeComponent },
	{ path: 'camera', component: CameraComponent },
	{ path: 'map', component: MapComponent }
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component';
// import { CameraComponent } from './pages/camera/camera.component';
// import { MapComponent } from './pages/map/map.component';

// const routes: Routes = [
// 	{
// 		path: 'tabs',
// 		component: HomeComponent,
// 		children: [
// 			{
// 				path: 'home',
// 				children: [
// 					{
// 						path: '',
// 						component: MapComponent // Display the Home component by default
// 					}
// 				]
// 			},
// 			{
// 				path: 'camera',
// 				children: [
// 					{
// 						path: '',
// 						component: CameraComponent // Display the Camera component
// 					}
// 				]
// 			}
// 			// {
// 			// 	path: 'profile',
// 			// 	children: [
// 			// 		{
// 			// 			path: '',
// 			// 			component: ProfileComponent // Add the Profile component here when you create it
// 			// 		}
// 			// 	]
// 			// }
// 		]
// 	},
// 	{
// 		path: '',
// 		redirectTo: 'tabs/home',
// 		pathMatch: 'full'
// 	}
// ];

// @NgModule({
// 	imports: [RouterModule.forRoot(routes)],
// 	exports: [RouterModule]
// })
// export class AppRoutingModule {}
