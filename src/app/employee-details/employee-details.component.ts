import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {
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

  gotoEmpList(selectedusertype:any){
    localStorage.setItem('selectedusertype', selectedusertype);
    this.router.navigate(['/emp-list']);
  }

}
