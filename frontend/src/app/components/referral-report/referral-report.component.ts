import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { RegisterReferralComponent } from '../register-referral/register-referral.component';
import { DriverService } from '../../core/services/driver.service';
import { ReferralService } from './../../core/services/referral.service';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface objCompleteOp {
  name: string;
  code: string;
}

@Component({
  selector: 'app-referral-report',
  imports: [
    ReactiveFormsModule,
    Select,
    FloatLabel,
    DatePicker,
    TableModule,
    RegisterReferralComponent,
    ButtonModule,
  ],
  templateUrl: './referral-report.component.html',
  styleUrl: './referral-report.component.css',
})
export class ReferralReportComponent implements OnInit {
  constructor(
    private driverService: DriverService,
    private referralService: ReferralService
  ) {}

  referralsData: any[] = [];
  drivers: any[] = [];

  obj_complete: objCompleteOp[] | undefined;

  filterForm = new FormGroup({
    referrerId: new FormControl(null),
    referredId: new FormControl(null),
    objStatus: new FormControl(null),
    referralDateRange: new FormControl(null),
  });

  getReferrals(): void {
    console.log(this.filterForm.value);
    this.referralService.getReferrals(this.filterForm.value).subscribe({
      next: (response) => {
        console.log(response);

        this.referralsData = response.map((referral: any) => {
          return {
            ...referral,
            referralDatelabel: new Date(
              referral.referralDate
            ).toLocaleDateString(),
          };
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.getReferrals();

    this.driverService.getDrivers().subscribe({
      next: (response) => {
        this.drivers = response.map((driver: any) => {
          return {
            label: `${driver.license} - ${driver.name}`,
            ...driver,
          };
        });
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.obj_complete = [
      { name: 'SI', code: 'COMPLETE' },
      { name: 'NO', code: 'INCOMPLETE' },
    ];
  }
}
