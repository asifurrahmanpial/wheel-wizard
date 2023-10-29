import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
@UntilDestroy()
export class AppComponent implements AfterViewInit {
	title = 'client';
	@ViewChild(MatSidenav)
	sidenav!: MatSidenav;

	constructor(
		private observer: BreakpointObserver,
		public router: Router,
		private authService: AuthService
	) {}

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
					this.sidenav.open();
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

	logOut() {
		this.authService.logOut();
		this.router.navigateByUrl('/login');
	}
}
