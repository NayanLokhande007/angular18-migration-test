import { Component } from '@angular/core';
import { GlobalServiceService } from '../global-service/global-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-emp-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emp-list.component.html',
  styleUrl: './emp-list.component.css'
})
export class EmpListComponent {
  employees: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { }

  emailid = localStorage.getItem('emailid');

  selectedusertype = localStorage.getItem('selectedusertype');

  selectedUser:any;

  ngOnInit(): void {
    if(this.selectedusertype=='1'){
      this.getAllContributors();
      this.selectedUser="Contributors"
    }else if(this.selectedusertype=='2'){
      this.getAllAssesors();
       this.selectedUser="Assesors"
    }else if(this.selectedusertype=='3'){
      this.getAllSolutionProviders(); 
       this.selectedUser="Solution Providers"
    }else if(this.selectedusertype=='4'){
      this.getAllProgrammers();
       this.selectedUser="Programmers"
    }else if(this.selectedusertype=='5'){
      this.getAllApprovers();
       this.selectedUser="Approvers"
    }else{
      this.getAllModerators();
       this.selectedUser="Moderators"
    }
  }

  getAllContributors() {
    this.globalservice.getAllContributors().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.employees = responsedata.data;
      }
    })
  }

  getAllAssesors() {
    this.globalservice.getAllAssesors().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.employees = responsedata.data;
      }
    })
  }

  getAllSolutionProviders() {
    this.globalservice.getAllSolutionProviders().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.employees = responsedata.data;
      }
    })
  }

  getAllProgrammers() {
    this.globalservice.getAllProgrammers().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.employees = responsedata.data;
      }
    })
  }

  getAllApprovers() {
    this.globalservice.getAllApprovers().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.employees = responsedata.data;
      }
    })
  }
  getAllModerators() {
    this.globalservice.getAllModerators().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.employees = responsedata.data;
      }
    })
  }


  gotoContributorProfile(emailid:any,firstname:any,lastname:any){
    localStorage.setItem('selectedemailid', emailid);
    localStorage.setItem('selectedfirstname', firstname);
    localStorage.setItem('selectedlastname', lastname);
    this.router.navigate(['/contributor-profile']);
  }

  gotoAssesorProfile(emailid:any,firstname:any,lastname:any){
    localStorage.setItem('selectedemailid', emailid);
    localStorage.setItem('selectedfirstname', firstname);
    localStorage.setItem('selectedlastname', lastname);
    this.router.navigate(['/assesor-profile']);
  }
  gotoSolutionproviderProfile(emailid:any,firstname:any,lastname:any){
    localStorage.setItem('selectedemailid', emailid);
    localStorage.setItem('selectedfirstname', firstname);
    localStorage.setItem('selectedlastname', lastname);
    this.router.navigate(['/solutionprovider-profile']);
  }
  gotoApproverProfile(emailid:any,firstname:any,lastname:any){
    localStorage.setItem('selectedemailid', emailid);
    localStorage.setItem('selectedfirstname', firstname);
    localStorage.setItem('selectedlastname', lastname);
    this.router.navigate(['/approver-profile']);
  }
  gotoProgrammerProfile(emailid:any,firstname:any,lastname:any){
    localStorage.setItem('selectedemailid', emailid);
    localStorage.setItem('selectedfirstname', firstname);
    localStorage.setItem('selectedlastname', lastname);
    this.router.navigate(['/programmer-profile']);
  }
  gotoModeratorProfile(emailid:any,firstname:any,lastname:any){
    localStorage.setItem('selectedemailid', emailid);
    localStorage.setItem('selectedfirstname', firstname);
    localStorage.setItem('selectedlastname', lastname);
    this.router.navigate(['/moderator-profile']);
  }

  gotoEmpDetails(){
    this.router.navigate(['/employee-details']);
  }
}
