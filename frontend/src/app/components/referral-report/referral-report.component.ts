import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-referral-report',
  imports: [Select, FloatLabel, DatePicker, TableModule],
  templateUrl: './referral-report.component.html',
  styleUrl: './referral-report.component.css',
})
export class ReferralReportComponent implements OnInit {
  drivers: any[] = [];
  obj_complete: any[] = [];

  ngOnInit() {
    this.drivers = [
      {
        name: 'Franco',
        code: '1',
        licence: '123',
        registerDate: '22-02-2025',
        obj_complete: 'si',
      },
      {
        name: 'Nicol',
        code: '2',
        licence: '123',
        registerDate: '22-02-2025',
        obj_complete: 'si',
      },
      {
        name: 'Roberto',
        code: '3',
        licence: '123',
        registerDate: '22-02-2025',
        obj_complete: 'si',
      },
      ,
    ];

    this.obj_complete = [
      { name: 'SI', code: 'true' },
      { name: 'NO', code: 'false' },
    ];
  }
}
