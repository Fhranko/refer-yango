import { Component, OnInit } from '@angular/core';
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
  drivers: any[] = [];

  ngOnInit() {
    this.drivers = [
      { name: 'Franco', code: '1' },
      { name: 'Nicol', code: '2' },
      { name: 'Roberto', code: '2' },
    ];
  }
}
