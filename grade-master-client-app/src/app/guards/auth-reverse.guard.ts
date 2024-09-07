import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const authReverseGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  if (!accountService.currentUser()) {
    return true;
  } else {
    router.navigate(['/courses']);
    return false;
  }
};
