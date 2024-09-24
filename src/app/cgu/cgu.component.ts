import { Component } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { ConfigService } from '../core/config.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../core/user.service';
import { Router } from '@angular/router';
import {User} from "../user";

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss'],
})
export class CguComponent {
  currentUser: User;
  error = false;
  selectedCountry = 'Any';
  selectedTermName = 'terms.md';
  countries = [];
  showCheckbox = false;
  checked = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    public configService: ConfigService,
    private locationStrategy: LocationStrategy
  ) {}

  ngOnInit() {
    this.getCountries();
    this.authService.getCurrentUser().subscribe(user => {
      const config = this.configService.config;
      if (user && config) {
        this.currentUser = user;
        if (
          Number(config.doctorTermsVersion) > Number(user.doctorTermsVersion)
        ) {
          this.showCheckbox = true;
        }
        if (Number(config.doctorTermsVersion) && !user.doctorTermsVersion) {
          this.showCheckbox = true;
        }
      }
    });
  }

  getCountries() {
    this.configService.getCountries().subscribe(
      res => {
        if (res) {
          res.unshift('Any');
          this.countries = res;
          this.error = false;
        }
      },
      error => {
        this.error = true;
      }
    );
  }

  goBack() {
    this.locationStrategy.historyGo(-1);
  }

  changeCountry(country: string) {
    this.selectedCountry = country;
    if (country === 'Any') {
      this.selectedTermName = 'terms.md';
    } else {
      this.selectedTermName = `terms.${country}.md`;
    }
  }
}
