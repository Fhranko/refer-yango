import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

import { Menubar } from 'primeng/menubar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, NgIf, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  items: any[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Registros',
        icon: 'pi pi-home',
        route: '/',
      },
      {
        label: 'Referir',
        icon: 'pi pi-star',
        route: '/referals',
      },

      {
        label: 'Pagos',
        icon: 'pi pi-envelope',
        route: '/payments',
      },
    ];
  }
}
