import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	switchMap,
	tap,
	throwError
} from 'rxjs';
import { UserData } from '../interfaces/auth';
import { StorageService } from './storage.service';

export const USER_STORAGE_KEY = 'APP_TOKEN';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private baseUrl = 'http://192.168.68.86:3000/';
	private user: BehaviorSubject<UserData | null | undefined> =
		new BehaviorSubject<UserData | null | undefined>(undefined);

	public isAuthenticated: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);
	token = '';

	constructor(
		private http: HttpClient,
		private storageService: StorageService,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.loadUser();
	}

	async setToken(token: string) {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem(USER_STORAGE_KEY, token);
		} else {
			await Preferences.set({ key: USER_STORAGE_KEY, value: token });
		}
	}

	async getToken() {
		if (isPlatformBrowser(this.platformId)) {
			return localStorage.getItem(USER_STORAGE_KEY);
		} else {
			const ret = await Preferences.get({ key: USER_STORAGE_KEY });
			return ret.value;
		}
	}

	async loadUser() {
		const token = await this.getToken();

		if (token) {
			const decoded = jwtDecode<JwtPayload>(token);
			const userData: UserData = {
				token: token,
				id: decoded.sub!
			};
			this.user.next(userData);
		} else {
			this.user.next(null);
		}
	}

	register(userData: { name: string; email: string; password: string }) {
		return this.http.post(`${this.baseUrl}auth/register`, userData).pipe(
			switchMap((data: any) => {
				return this.login(userData.email, userData.password);
				// return data;
			})
		);
	}

	login(email: string, password: string) {
		return this.http
			.post(`${this.baseUrl}auth/login`, { email, password })
			.pipe(
				map(async (data: any) => {
					await this.setToken(data.token);

					// Log the token
					console.log('Token:', data.token);

					const decoded = jwtDecode<JwtPayload>(data.token);

					// Log the decoded token
					console.log('Decoded token:', decoded);

					const userData: UserData = {
						token: data.token,
						id: decoded.sub!
					};

					// Log the user ID
					console.log('User ID:', userData.id);

					this.user.next(userData);

					// Store user ID in the same way as the token
					await Preferences.set({ key: 'userId', value: userData.id });

					return userData;
				})
			);
	}

	getProfile(): Observable<any> {
		return this.http.get(`${this.baseUrl}profile/${this.getCurrentUserId()}`);
	}

	currentUsername = new BehaviorSubject<string | null>(null);

	async logOut() {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem(USER_STORAGE_KEY);
		} else {
			await Preferences.remove({ key: USER_STORAGE_KEY });
		}
		this.user.next(null);
	}

	getCurrentUser() {
		return this.user.asObservable();
	}

	getCurrentUserId() {
		return this.user.getValue()?.id;
	}
	isLoggedIn(): Observable<boolean | UrlTree> {
		const router = this.router;

		return this.getCurrentUser().pipe(
			map((user) => {
				if (user) {
					return true;
				} else {
					return router.createUrlTree(['/']);
				}
			})
		);
	}

	shouldLogIn(): Observable<boolean | UrlTree> {
		const router = this.router;

		return this.getCurrentUser().pipe(
			map((user) => {
				if (user) {
					return router.createUrlTree(['/map']);
				} else {
					return true;
				}
			})
		);
	}

	async getRideHistory() {
		const token = await this.getToken();
		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`
		});
		return this.http.get(`${this.baseUrl}rides/history`, { headers }).pipe(
			tap((data) => {
				console.log(data);
			})
		);
	}

	async createRide(rideDetails: any) {
		const token = await this.getToken();
		console.log('Token:', token); // Log the token
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		});
		return this.http
			.post(`${this.baseUrl}rides`, rideDetails, { headers })
			.pipe(
				tap((data) => {
					console.log(data);
				})
			)
			.toPromise(); // Convert Observable to Promise
	}

	async getVehicles() {
		return this.http
			.get(`${this.baseUrl}vehicles`)
			.pipe(tap((response) => console.log('getVehicles response:', response)))
			.toPromise();
	}

	async updateVehicles(
		vehicleId: string,
		updateData: { coordinates: [number, number] }
	) {
		console.log('Updating vehicle:', vehicleId);
		console.log('Update data:', updateData);
		const response = await this.http
			.put(`${this.baseUrl}vehicles/${vehicleId}`, updateData)
			.toPromise();
		console.log('Server response:', response);
		return response;
	}
}

// !Coookies

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Router, UrlTree } from '@angular/router';
// import { JwtPayload, jwtDecode } from 'jwt-decode';
// import { BehaviorSubject, Observable, filter, map, switchMap, tap } from 'rxjs';
// import { UserData } from '../interfaces/auth';
// import { CookieService } from 'ngx-cookie-service';
// export const USER_STORAGE_KEY = 'APP_TOKEN';

// @Injectable({
// 	providedIn: 'root'
// })
// export class AuthService {
// 	private baseUrl = 'http://localhost:4000/';
// 	private user: BehaviorSubject<UserData | null | undefined> =
// 		new BehaviorSubject<UserData | null | undefined>(undefined);

// 	constructor(
// 		private http: HttpClient,
// 		private cookieService: CookieService
// 	) {
// 		this.loadUser();
// 	}

// 	loadUser() {
// 		const token = this.cookieService.get(USER_STORAGE_KEY);

// 		if (token) {
// 			const decoded = jwtDecode<JwtPayload>(token);
// 			const userData: UserData = {
// 				token: token,
// 				id: decoded.sub!
// 			};
// 			this.user.next(userData);
// 		} else {
// 			this.user.next(null);
// 		}
// 	}

// 	register(userData: { name: string; email: string; password: string }) {
// 		return this.http.post(`${this.baseUrl}auth/register`, userData).pipe(
// 			switchMap((data: any) => {
// 				return this.login(userData.email, userData.password);
// 			})
// 		);
// 	}

// 	login(email: string, password: string) {
// 		return this.http
// 			.post(`${this.baseUrl}auth/login`, { email, password })
// 			.pipe(
// 				map((data: any) => {
// 					this.cookieService.set(USER_STORAGE_KEY, data.token);
// 					const decoded = jwtDecode<JwtPayload>(data.token);

// 					const userData: UserData = {
// 						token: data.token,
// 						id: decoded.sub!
// 					};
// 					this.user.next(userData);
// 					return userData;
// 				})
// 			);
// 	}

// 	logOut() {
// 		this.cookieService.delete(USER_STORAGE_KEY);
// 		this.user.next(null);
// 		console.log('logged out');
// 	}

// 	getCurrentUser() {
// 		return this.user.asObservable();
// 	}

// 	getCurrentUserId() {
// 		return this.user.getValue()?.id;
// 	}

// 	isLoggedIn(): Observable<boolean | UrlTree> {
// 		const router = inject(Router);

// 		return this.getCurrentUser().pipe(
// 			filter((user) => user !== undefined),
// 			map((isAuthenticated) => {
// 				if (isAuthenticated) {
// 					return true;
// 				} else {
// 					return router.createUrlTree(['/']);
// 				}
// 			})
// 		);
// 	}

// 	shouldLogIn(): Observable<boolean | UrlTree> {
// 		const router = inject(Router);

// 		return this.getCurrentUser().pipe(
// 			filter((user) => user !== undefined),
// 			map((isAuthenticated) => {
// 				if (isAuthenticated) {
// 					return router.createUrlTree(['/map']);
// 				} else {
// 					return true;
// 				}
// 			})
// 		);
// 	}
// 	getRideHistory() {
// 		const headers = new HttpHeaders({
// 			Authorization: `Bearer ${this.cookieService.get(USER_STORAGE_KEY)}`
// 		});
// 		return this.http.get(`${this.baseUrl}rides/history`, { headers }).pipe(
// 			tap((data) => {
// 				console.log(data);
// 			})
// 		);
// 	}

// 	createRide() {
// 		const headers = new HttpHeaders({
// 			Authorization: `Bearer ${this.cookieService.get(USER_STORAGE_KEY)}`
// 		});
// 		return this.http.get(`${this.baseUrl}rides`, { headers }).pipe(
// 			tap((data) => {
// 				console.log(data);
// 			})
// 		);
// 	}
// }
