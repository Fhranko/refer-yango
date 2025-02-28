import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../core/services/driver.service';

import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register-referral',
  imports: [FloatLabelModule, SelectModule, CardModule, ButtonModule],
  templateUrl: './register-referral.component.html',
  styleUrl: './register-referral.component.css',
})
export class RegisterReferralComponent implements OnInit {
  constructor(private driverService: DriverService) {}

  drivers: any[] = [];

  ngOnInit() {
    this.driverService.getDrivers().subscribe({
      next: (response) => {
        this.drivers = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
