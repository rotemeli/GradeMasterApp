import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(public accountService: AccountService, private _router: Router) {}
  ngOnInit(): void {}

  logout() {
    this.accountService.logout();
    this._router.navigate(['/']);
  }
}
