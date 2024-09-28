import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IChangePasswordData } from '../../models/user.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(
    private _accountService: AccountService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmNewPassword: new FormControl('', [
        Validators.required,
        this.passwordsMatchValidator.bind(this),
      ]),
    });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.changePasswordForm?.get('newPassword')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  changePassword(formData: IChangePasswordData): void {
    this._accountService.changePassword(formData).subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this.changePasswordForm.reset();
        this._router.navigate(['/']);
      },
      error: (err) => {
        const errorMessage =
          err.error?.message || 'Failed to change password. Please try again.';
        this._toastr.error(errorMessage);
        console.error(err);
      },
    });
  }

  onSubmit() {
    const teacherEmail = this._accountService.teacherEmail;
    if (this.changePasswordForm.invalid || !teacherEmail) return;
    const formData: IChangePasswordData = {
      email: teacherEmail,
      currentPassword: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
    };
    this.changePassword(formData);
  }

  onCancel() {
    this._toastr.info('Change Password has been cancelled.');
  }
}
