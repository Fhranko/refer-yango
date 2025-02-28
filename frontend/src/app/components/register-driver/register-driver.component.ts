import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../core/services/driver.service';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-register-driver',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FloatLabel,
    Select,
    ButtonModule,
    Toast,
    CardModule,
  ],
  templateUrl: './register-driver.component.html',
  styleUrl: './register-driver.component.css',
  providers: [MessageService],
})
export class RegisterDriverComponent implements OnInit {
  constructor(
    private driverService: DriverService,
    private messageService: MessageService
  ) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    license: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    cellphone: new FormControl('', []),
    city: new FormControl('', [Validators.required]),
  });

  cities: any[] = [];

  ngOnInit() {
    this.cities = [
      { name: 'La Paz', code: 'LP' },
      { name: 'Cochabamba', code: 'CBBA' },
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al procesar la solicitud',
        detail: 'Por favor, complete todos los campos.',
        life: 3000,
      });
      return;
    }

    this.driverService.registerDriver(this.form.value).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: response.message,
          life: 3000,
        });

        this.form.reset();
      },
      error: (error) => {
        console.log(error);
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
