import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent,NavbarComponent,RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
