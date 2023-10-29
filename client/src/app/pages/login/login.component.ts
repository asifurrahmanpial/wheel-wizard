import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	loginForm = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(4)]]
	});

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private snackBar: MatSnackBar,
		private router: Router
	) {}

	get email() {
		return this.loginForm.controls['email'];
	}

	get password() {
		return this.loginForm.controls['password'];
	}

	logIn() {
		console.log(this.loginForm.value);
		const { email, password } = this.loginForm.getRawValue();
		this.authService.login(email, password).subscribe(
			(response) => {
				this.router.navigate(['/map']);
				this.snackBar.open('Logged in successfully', 'Close', {
					duration: 2000
				});
			},
			(error) => {
				if (error.status === 200) {
					this.snackBar.open("User doesn't exist", 'Close', {
						duration: 2000
					});
				} else {
					// Handle other errors
					this.snackBar.open(
						'An error occurred. Please try again later.',
						'Close',
						{
							duration: 2000
						}
					);
				}
			}
		);
	}
}
