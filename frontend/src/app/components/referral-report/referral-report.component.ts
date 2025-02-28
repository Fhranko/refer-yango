import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { RegisterReferralComponent } from '../register-referral/register-referral.component';
import { DriverService } from '../../core/services/driver.service';

@Component({
  selector: 'app-referral-report',
  imports: [
    Select,
    FloatLabel,
    DatePicker,
    TableModule,
    RegisterReferralComponent,
  ],
  templateUrl: './referral-report.component.html',
  styleUrl: './referral-report.component.css',
})
export class ReferralReportComponent implements OnInit {
  constructor(private driverService: DriverService) {}

  drivers: any[] = [];
  obj_complete: any[] = [];

  ngOnInit() {
    this.driverService.getDrivers().subscribe({
      next: (response) => {
        console.log(response);
        this.drivers = response;
      },
      error: (error) => {
        console.error(error);
      },
    });

    // this.drivers = [
    //   {
    //     name: 'Franco',
    //     code: '1',
    //     licence: '123',
    //     registerDate: '22-02-2025',
    //     obj_complete: 'si',
    //   },
    //   {
    //     name: 'Nicol',
    //     code: '2',
    //     licence: '123',
    //     registerDate: '22-02-2025',
    //     obj_complete: 'si',
    //   },
    //   {
    //     name: 'Roberto',
    //     code: '3',
    //     licence: '123',
    //     registerDate: '22-02-2025',
    //     obj_complete: 'si',
    //   },
    // ];

    this.obj_complete = [
      { name: 'SI', code: 'true' },
      { name: 'NO', code: 'false' },
    ];
  }
}
