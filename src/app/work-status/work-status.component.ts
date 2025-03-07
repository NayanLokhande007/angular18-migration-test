import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-work-status',
  standalone: true,
  imports: [],
  templateUrl: './work-status.component.html',
  styleUrl: './work-status.component.css'
})
export class WorkStatusComponent {
  constructor(private router: Router) { }
  gotoDashboard(){
    this.router.navigate(['/dashboard']);
  }

  gotoWorkStatus(){
    this.router.navigate(['/work-status']);
  }

  gotoEmployeeDetails(){
    this.router.navigate(['/employee-details']);
  }
  gotoLogOut(){
    this.router.navigate(['/login']);
  }

  gotoProfile(){
    this.router.navigate(['/profile']);
  }
}
