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

// import { Component } from '@angular/core';
// import {
// 	FormGroup,
// 	FormBuilder,
// 	Validators,
// 	AbstractControl
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { AuthService } from '../../services/auth.service';

// @Component({
// 	selector: 'app-login',
// 	templateUrl: './login.component.html',
// 	styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
// 	loginForm: FormGroup;
// 	email: AbstractControl;
// 	password: AbstractControl;

// 	constructor(
// 		private formBuilder: FormBuilder,
// 		private authService: AuthService,
// 		private router: Router,
// 		private snackBar: MatSnackBar
// 	) {
// 		this.loginForm = this.formBuilder.group({
// 			email: ['', [Validators.required, Validators.email]],
// 			password: ['', [Validators.required]]
// 		});
// 		this.email = this.loginForm.controls['email'];
// 		this.password = this.loginForm.controls['password'];
// 	}

// 	logIn() {
// 		if (this.loginForm.invalid) {
// 			this.snackBar.open('Please fill in valid credentials', 'Close', {
// 				duration: 2000
// 			});
// 			return;
// 		}

// 		const formData = {
// 			email: this.email.value,
// 			password: this.password.value
// 		};

// 		this.authService
// 			.login(formData)
// 			.then((response) => {
// 				if (response) {
// 					this.router.navigate(['/map']);
// 					this.snackBar.open('Logged in successfully', 'Close', {
// 						duration: 2000
// 					});
// 				} else {
// 					this.snackBar.open("User doesn't exist", 'Close', {
// 						duration: 2000
// 					});
// 				}
// 			})
// 			.catch((error) => {
// 				// Handle other errors
// 				this.snackBar.open(
// 					'An error occurred. Please try again later.',
// 					'Close',
// 					{
// 						duration: 2000
// 					}
// 				);
// 			});
// 	}
// }
