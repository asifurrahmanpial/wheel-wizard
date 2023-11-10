import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
@UntilDestroy()
export class AppComponent implements AfterViewInit, OnInit {
	title = 'client';
	@ViewChild(MatSidenav)
	sidenav!: MatSidenav;
	username!: string | null;

	constructor(
		private observer: BreakpointObserver,
		public router: Router,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		this.authService.currentUsername.subscribe((username) => {
			this.username = username;
		});
	}

	ngAfterViewInit(): void {
		this.observer
			.observe(['(max-width: 800px)'])
			.pipe(delay(1), untilDestroyed(this))
			.subscribe((res: any) => {
				if (res.matches) {
					this.sidenav.mode = 'over';
					this.sidenav.close();
				} else {
					this.sidenav.mode = 'side';
					this.sidenav.close();
				}
			});

		this.router.events
			.pipe(
				untilDestroyed(this),
				filter((e) => e instanceof NavigationEnd)
			)
			.subscribe(() => {
				if (this.sidenav.mode === 'over') {
					this.sidenav.close();
				}
			});
	}

	isActive(route: string): boolean {
		return this.router.url === route;
	}

	logOut() {
		this.authService.logOut();
		this.sidenav.close(); // Close the sidenav
		this.router.navigateByUrl('/login');
	}
}
