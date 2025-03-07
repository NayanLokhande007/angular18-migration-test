import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalServiceService } from '../global-service/global-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm !: FormGroup;
  profile: any;
  designation: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { }
  emailid = localStorage.getItem('emailid');
  firstname=localStorage.getItem('firstname');
  lastname=localStorage.getItem('lastname');
  gender:any;

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileno: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', Validators.required],
    });

    this.getProfileDetails();
  }

  getProfileDetails() {
    this.globalservice.getProfile(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.profile = responsedata.data;
        this.profileForm.patchValue({
          firstName: this.profile.firstname,
          lastName: this.profile.lastname,
          gender: this.profile.gender,
          userType: this.profile.usertype,
          email: this.profile.emailid,
          mobileno: this.profile.mobileno,
          address: this.profile.address,
          city:this.profile.city,
          country:this.profile.country,
          state:this.profile.state,
          district:this.profile.district,
          pincode:this.profile.pincode
        })
 
        if(this.profile.usertype==1){
          this.designation="Contributor";
        }
        if(this.profile.usertype==2){
          this.designation="Assesor";
        }
        if(this.profile.usertype==3){
          this.designation="Solution Provider";
        }
        if(this.profile.usertype==4){
          this.designation="Programmer";
        }
        if(this.profile.usertype==5){
          this.designation="Approver";
        }
        if(this.profile.usertype==6){
          this.designation="Modetator";
        }
        if(this.profile.usertype==7){
          this.designation="Admin";
        }
       
        this.profileForm.patchValue({
          designation:this.designation
        })
        this.gender=this.profile.gender
      }
    })
  }

  updateProfile(){
    Swal.fire({
      html: `A SweetAlert content with <strong>bold text</strong>, <a href="#">links</a>
           or any of our available <span class="badge badge-primary">components</span>`,
      icon: "info",
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonText: "Ok, got it!",
      cancelButtonText: 'Nope, cancel it',
      customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: 'btn btn-danger'
      }
  });
  }

  gotoLogOut() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#214565',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/welcome']);
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Logout successfully !',
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }
}
