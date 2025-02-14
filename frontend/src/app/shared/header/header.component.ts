import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuItems = [
    {
      label: 'Registrar',
      icon: 'pi pi-user-plus',
      routerLink: '/drivers/register',
    },
    {
      label: 'Referir',
      icon: 'pi pi-share-alt',
      routerLink: '/referrals/register',
    },
  ];
}
