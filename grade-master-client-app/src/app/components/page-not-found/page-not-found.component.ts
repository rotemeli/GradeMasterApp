import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
  constructor(private _accountService: AccountService) {}

  get homepageRoute(): string {
    return this._accountService.currentUser() ? '/courses' : '/';
  }
}
