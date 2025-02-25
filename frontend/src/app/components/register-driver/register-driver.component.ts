import { Component, OnInit } from '@angular/core';

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

@Component({
  selector: 'app-register-driver',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FloatLabel,
    Select,
    ButtonModule,
  ],
  templateUrl: './register-driver.component.html',
  styleUrl: './register-driver.component.css',
})
export class RegisterDriverComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    licence: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    phone: new FormControl('', [Validators.required, Validators.minLength(3)]),
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
    // console.warn(this.registerForm.value);
  }
}
