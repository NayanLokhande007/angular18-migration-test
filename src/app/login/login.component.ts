import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BackendserviceService } from '../services/backendservice.service';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loginForm!: FormGroup;
  loginDetails: any;
  showText: boolean = false;
  loading : boolean = false; // Add loading state variable
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private backendservice: BackendserviceService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({  
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.backendservice.loading$.subscribe(isLoading => {
      this.loading = isLoading; // Update loading state
    });

  }
  
  login() {
    if(!this.loginForm.valid){
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Please provide Email ID and Password.',
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
      });
    }else{
      Swal.fire({
        title: 'Confirm Login',
        text: 'Are you sure you want to log in?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#214565',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log me in!',
        didOpen: () => {
          const okButton = Swal.getConfirmButton();
          if (okButton) {
            okButton.id = 'confirmLogin-btn'; // Assign your desired ID
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.loginForm.valid) {
          
            this.backendservice.Login(this.loginForm.value).subscribe(
              (result) => {
                Swal.close(); // Close the loading spinner
                this.loginDetails = JSON.parse(JSON.stringify(result));
                if (this.loginDetails.status === 200 && this.loginDetails.data.status === 1) {
                  // Store details in local storage
                  localStorage.setItem('emailid', this.loginDetails.data.emailid);
                  localStorage.setItem('firstname', this.loginDetails.data.firstname);
                  localStorage.setItem('lastname', this.loginDetails.data.lastname);
                  localStorage.setItem('usertype', this.loginDetails.data.usertype);
    
                  // Show a success toast notification
                  Swal.fire({
                    toast: true,
                    icon: 'success',
                    title: 'Login Successfully',
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 3000,
                  });
    
                  // Redirect based on user type
                  this.redirectUser(this.loginDetails.data.usertype);
                } else {
                  this.loading=false;
                  Swal.fire({
                    toast: true,
                    icon: 'error',
                    title: 'Login Failed: You do not have access to log in!',
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              (error) => {
                // Handle server or network errors
                this.loading=false;
                Swal.fire({
                  toast: true,
                  icon: 'error',
                  title: 'Invalid credentials',
                  position: 'top-right',
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            );
          } else {
            Swal.fire({
              toast: true,
              icon: 'error',
              title: 'Please provide Email ID and Password.',
              position: 'top-right',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      });
    }
    
  }
  





  // Redirect user based on user type
  redirectUser(usertype: number) {
    switch (usertype) {
      case 5:
        this.router.navigate(['/ap-dashboard']);
        break;
      case 1:
        // this.triggerConfetti();
        this.router.navigate(['/contributor']);
        break;
      case 2:
        this.router.navigate(['/as-dashboard']);
        break;
      case 3:
        this.router.navigate(['/solution-provider-dashboard']);
        break;
      case 4:
        this.router.navigate(['/dashboard']);
        break;
      case 6:
        this.router.navigate(['/moderator-dashboard']);
        break;

      case 7:
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/moderated-var']);
    }
  }

  gotoRegisterPage(){
    this.router.navigate(['/register']);
  }

  onUserApproval() {
    document.getElementById('particles-js')?.classList.add('show');
  }

  triggerConfetti() {
    this.showText = true; // Show the text
    
    // Trigger the confetti effect
    confetti({
      spread: 300,
      particleCount: 500,
      origin: { y: 0.5 },
    });

   
    Swal.fire({
      toast: true,
      icon: 'success',
      title: 'Congratulations your Question is approved',
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
    });
    // Hide the text after a few seconds (optional)
    setTimeout(() => {
      this.showText = false;
    }, 5000); // Adjust the duration as needed
  }
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login(); // Call the login function when Enter is pressed
      event.preventDefault(); // Prevent the default action if needed
    }
  }

  gotoHome(){
    this.router.navigate(['/welcome']);
  }
  forgotPassword(){
    Swal.fire({
      toast: true,
      icon: 'info',
      title: 'Please contact to admin.',
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}


