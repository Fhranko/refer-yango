import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [ReactiveFormsModule, ToastModule, Select],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.css',
  providers: [MessageService],
})
export class DriverFormComponent {
  constructor(private messageService: MessageService) {}

  cities = [
    { label: 'Selecciona una ciudad', value: null },
    { label: 'La Paz', value: 'La Paz' },
    { label: 'Cochabamba', value: 'Cochabamba' },
  ];
  // registerForm: FormGroup;

  // constructor(private fb: FormBuilder, private messageService: MessageService) {
  //   this.registerForm = this.fb.group({
  //     name: ['', Validators.required],
  //     license: ['', Validators.required],
  //     cellphone: ['', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
  //     city: [null, Validators.required],
  //   });
  // }

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    license: new FormControl('', Validators.required),
    cellphone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{7,}$/),
    ]),
    city: new FormControl('', Validators.required),
  });

  async onSubmit() {
    if (this.registerForm.valid) {
      // this.messageService.add({
      //   severity: 'warn',
      //   summary: 'Formulario inválido',
      //   detail: 'Por favor completa todos los campos correctamente.',
      // });
      console.log('Formulario enviado:', this.registerForm.value);
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Enviado',
        life: 3000,
      });
    } else {
      console.log('Formulario inválido.');
      this.messageService.add({
        severity: 'error',
        summary: 'Info',
        detail: 'Error formulario inválido',
        life: 3000,
      });
    }
    // try {
    //   const response = await fetch('/drivers/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(this.registerForm.value),
    //   });
    //   const result = await response.json();
    //   if (result.status === 'success') {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Registro exitoso',
    //       detail: result.message,
    //     });
    //     this.registerForm.reset();
    //   } else {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error al registrar',
    //       detail: result.message,
    //     });
    //   }
    // } catch (error: any) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: error.message,
    //   });
    // }
  }
}
