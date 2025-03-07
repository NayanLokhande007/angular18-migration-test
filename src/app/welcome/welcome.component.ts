import { Component } from '@angular/core';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { }

  gotoLogin(){
    this.router.navigate(['/login']);
  }
  gotoRegister(){
    this.router.navigate(['/register']);
  }
}
