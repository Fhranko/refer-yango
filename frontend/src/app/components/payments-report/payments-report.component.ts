import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-payments-report',
  imports: [Select, FloatLabel, TableModule],
  templateUrl: './payments-report.component.html',
  styleUrl: './payments-report.component.css',
})
export class PaymentsReportComponent implements OnInit {
  payments: any[] = [];

  ngOnInit() {
    this.payments = [
      {
        name: 'Franco',
        level: '1',
        amount: '20',
        status: 'pending',
      },
      {
        name: 'Nicol',
        level: '1',
        amount: '20',
        status: 'pending',
      },
      {
        name: 'Roberto',
        level: '3',
        amount: '10',
        status: 'paid',
      },
      ,
    ];
  }
}
