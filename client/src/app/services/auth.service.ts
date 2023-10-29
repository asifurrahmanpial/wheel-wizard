import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, filter, map, switchMap } from 'rxjs';
import { UserData } from '../interfaces/auth';

export const USER_STORAGE_KEY = 'APP_TOKEN';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private baseUrl = 'http://localhost:3000/';
	private user: BehaviorSubject<UserData | null | undefined> =
		new BehaviorSubject<UserData | null | undefined>(undefined);

	constructor(private http: HttpClient) {
		this.loadUser();
	}

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

	register(name: string, email: string, password: string) {
		return this.http
			.post(`${this.baseUrl}auth/register`, { name, email, password })
			.pipe(
				switchMap((data: any) => {
					return this.login(email, password);
					console.log(data);
				})
			);
	}

	login(email: string, password: string) {
		return this.http
			.post(`${this.baseUrl}auth/login`, { email, password })
			.pipe(
				map((data: any) => {
					console.log(data);
					localStorage.setItem(USER_STORAGE_KEY, data.token);
					const decoded = jwtDecode<JwtPayload>(data.token);
					console.log(decoded);

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
			filter((user) => user !== undefined),
			map((isAuthenticated) => {
				if (isAuthenticated) {
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
			filter((user) => user !== undefined),
			map((isAuthenticated) => {
				if (isAuthenticated) {
					return router.createUrlTree(['/map']);
				} else {
					return true;
				}
			})
		);
	}
}
