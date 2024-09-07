import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private _accountSvc: AccountService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      institution: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.passwordsMatchValidator.bind(this),
      ]),
    });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.registrationForm?.get('password')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onCancel() {
    this._toastr.info('Registration has been cancelled.');
  }

  register() {
    this._accountSvc.register(this.registrationForm.value).subscribe({
      next: (_) => this._router.navigate(['/']),
      error: (error) => {
        throw error;
      },
    });
  }

  onSubmit() {
    if (!this.registrationForm.valid) return;
    this.register();
    this.registrationForm.reset();
    this._toastr.success('Registration is complete.');
    this._router.navigate(['/']);
  }
}
