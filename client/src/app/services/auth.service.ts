import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { UserData } from '../interfaces/auth';
export const USER_STORAGE_KEY = 'APP_TOKEN';
import { StorageService } from './storage.service';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

interface userData {
	email: string;
	password: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private baseUrl = 'http://localhost:4000/';
	private user: BehaviorSubject<UserData | null | undefined> =
		new BehaviorSubject<UserData | null | undefined>(undefined);

	// for mobile
	public isAuthenticated: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);
	token = '';

	constructor(
		private http: HttpClient,
		private storageService: StorageService,
		private router: Router
	) {
		this.loadUser();
		this.isMobile();

		// for mobile
		this.loadToken();
	}

	private async isMobile(): Promise<boolean> {
		// Use Capacitor Device API or any other method to determine device type
		const deviceInfo = await Device.getInfo();
		return deviceInfo.platform === 'android' || deviceInfo.platform === 'ios';
	}
	// For PC
	loadUser() {
		const token = localStorage.getItem(USER_STORAGE_KEY);

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
			})
		);
	}

	login(email: string, password: string) {
		return this.http
			.post(`${this.baseUrl}auth/login`, { email, password })
			.pipe(
				map((data: any) => {
					localStorage.setItem(USER_STORAGE_KEY, data.token);
					const decoded = jwtDecode<JwtPayload>(data.token);

					const userData: UserData = {
						token: data.token,
						id: decoded.sub!
					};
					this.user.next(userData);
					return userData;
				})
			);
	}

	logOut() {
		localStorage.removeItem(USER_STORAGE_KEY);
		this.user.next(null);
		console.log('logged out');
	}

	getCurrentUser() {
		return this.user.asObservable();
	}

	getCurrentUserId() {
		return this.user.getValue()?.id;
	}

	isLoggedIn(): Observable<boolean | UrlTree> {
		const router = inject(Router);

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
		const router = inject(Router);

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

	getRideHistory() {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem(USER_STORAGE_KEY)}`
		});
		return this.http.get(`${this.baseUrl}rides/history`, { headers }).pipe(
			tap((data) => {
				console.log(data);
			})
		);
	}

	createRide() {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem(USER_STORAGE_KEY)}`
		});
		return this.http.get(`${this.baseUrl}rides`, { headers }).pipe(
			tap((data) => {
				console.log(data);
			})
		);
	}

	// For Mobile
	async loadToken() {
		const token = await this.storageService.get('token');
		if (token) {
			this.isAuthenticated.next(true);
		} else {
			this.isAuthenticated.next(false);
		}
	}

	// async login(userData: userData) {
	// 	if (!userData) return null;

	// 	const isMobile = await this.isMobile();

	// 	if (isMobile) {
	// 		const options = {
	// 			url: `${this.baseUrl}auth/login`,
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			data: JSON.stringify(userData)
	// 		};

	// 		try {
	// 			const response: HttpResponse = await CapacitorHttp.post(options);
	// 			const res = response.data;

	// 			if (res && res.token) {
	// 				this.storageService.set('token', res.token);
	// 				this.isAuthenticated.next(true);
	// 				this.router.navigateByUrl('/map', { replaceUrl: true });
	// 				return;
	// 			}
	// 		} catch (e) {
	// 			return null;
	// 		}
	// 	} else {
	// 		return this.http.post(`${this.baseUrl}auth/login`, userData).pipe(
	// 			map((data: any) => {
	// 				localStorage.setItem(USER_STORAGE_KEY, data.token);
	// 				const decoded = jwtDecode<JwtPayload>(data.token);

	// 				const userData: UserData = {
	// 					token: data.token,
	// 					id: decoded.sub!
	// 				};
	// 				this.user.next(userData);
	// 				return userData;
	// 			})
	// 		);
	// 	}

	// 	return null; // Default return statement
	// }
}

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
