import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from 'src/app/directives/password-match.directive';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
	registrationForm = this.fb.group(
		{
			name: [
				'',
				[Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]
			],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		},
		{
			validators: passwordMatchValidator
		}
	);

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private snackBar: MatSnackBar,
		private router: Router
	) {}

	get name() {
		return this.registrationForm.controls['name'];
	}

	get email() {
		return this.registrationForm.controls['email'];
	}

	get password() {
		return this.registrationForm.controls['password'];
	}

	get confirmPassword() {
		return this.registrationForm.controls['confirmPassword'];
	}

	// register() {
	// 	console.log(this.registrationForm.value);
	// 	const postData = { ...this.registrationForm.value };
	// 	console.log(postData);
	// }

	register() {
		console.log(this.registrationForm.value);
		const { name, email, password } = this.registrationForm.getRawValue();
		this.authService
			.register(name || '', email || '', password || '')
			.subscribe(
				(response) => {
					this.router.navigate(['/login']);
					this.snackBar.open('Registered in successfully', 'Close', {
						duration: 2000
					});
				},
				(error) => {
					if (error.status === 200) {
						this.snackBar.open('User already exists', 'Close', {
							duration: 2000
						});
					} else {
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
