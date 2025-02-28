import { Component, OnInit } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DriverService } from '../../core/services/driver.service';
import { ReferralService } from './../../core/services/referral.service';

import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register-referral',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    SelectModule,
    CardModule,
    ButtonModule,
    Toast,
  ],
  templateUrl: './register-referral.component.html',
  styleUrl: './register-referral.component.css',
  providers: [MessageService],
})
export class RegisterReferralComponent implements OnInit {
  constructor(
    private driverService: DriverService,
    private referralService: ReferralService,
    private messageService: MessageService
  ) {}

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

  referralForm = new FormGroup({
    referrer_id: new FormControl('', [Validators.required]),
    referred_id: new FormControl('', [Validators.required]),
  });

  registerReferral(): void {
    console.log('Registering referral...');

    if (this.referralForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al procesar la solicitud',
        detail: 'Por favor, complete todos los campos.',
        life: 3000,
      });
      return;
    }

    this.referralService.registerReferral(this.referralForm.value).subscribe({
      next: (response) => {
        console.log(response, 'OK');
        this.messageService.add({
          severity: 'success',
          summary: 'Referido registrado',
          detail: response.message,
          life: 3000,
        });
        this.referralForm.reset();
      },
      error: (error) => {
        console.log(error, 'ERROR');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al procesar la solicitud',
          detail: error.message,
          life: 3000,
        });
      },
    });
  }
}
