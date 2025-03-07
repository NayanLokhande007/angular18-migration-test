import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  currentDay: string | undefined;
  currentDate: string | undefined;
  
  loading : boolean = false; 
  selectedUserType: any;
  emailid:any;
  emailverified:number=0;
  showPassword: boolean = false;
  
  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      userType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileno: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      workinglanguage:['', Validators.required]
    });

    this.updateDay();
    this.globalservice.loading$.subscribe(isLoading => {
      this.loading = isLoading; // Update loading state
    });
    
  }

getEmailid() {
  this.emailid = this.registrationForm.get('email')?.value || '';
}

verifyEmail() {
  // Get the email ID from the form
  this.emailid = this.registrationForm.get('email')?.value;
  // Check if the email is entered
  if (!this.emailid) {
    alert('Please enter a valid email address!');
    return;
  }
  // Call the backend service
  this.globalservice.verifyEmail(this.emailid).subscribe(
    (result: any) => {
      // Handle success response
      if (result.status === 200) {
         Swal.fire({
                toast: true,
                icon: 'error',
                title: 'Emailid is already registered !',
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
              });
      }
    },
    (error) => {
      if (error.status === 404) {
        this.emailverified=1;     
      } else {
        alert('An error occurred while verifying the email.');
      }
    }
  );
}

  onLanguageChange(language: string) {
    const currentSelection = this.registrationForm.get('workinglanguage')?.value;
     this.registrationForm.patchValue({
      workinglanguage: currentSelection
    });
  }

  getSelectedUserType(event:any){
    this.selectedUserType = event.target.value;
    this.registrationForm.patchValue({
      userType:this.selectedUserType,
    });
  }
  
  updateDay(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    this.currentDay = now.toLocaleDateString('en-US', options);
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(now.getFullYear()).slice(-2);
    this.currentDate = `${day}/${month}/${year}`;
  }
  gotoLogin(){
    this.router.navigate(['/login']);
  }
  Register() {
    if (this.registrationForm.valid) {
      this.globalservice.Register(this.registrationForm.value,this.currentDate).subscribe(result => {
        const data = JSON.parse(JSON.stringify(result));
        if (data.status == 200) {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Registred Successfully !',
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
          });
          this.router.navigate(['/login']);
        } else {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Something went wrong !',
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      });
    } else {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'fill all details correctly',
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.registrationForm.reset();
    } else {
    }
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
