import { Component } from '@angular/core';
import { GlobalServiceService } from '../global-service/global-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";



@Component({
  selector: 'app-login-request',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './login-request.component.html',
  styleUrl: './login-request.component.css'
})
export class LoginRequestComponent {

 

  loading : boolean = false; 
  currentDay: string | undefined;
  currentDate: string | undefined;
  loginRequests: any[] = [];
  declineStatus: any;
  constructor( private globalservice: GlobalServiceService,private router: Router) { }

  ngOnInit(): void {
    this.updateDay();
    this.getLoginRequets();
    this.globalservice.loading$.subscribe(isLoading => {
      this.loading = isLoading; // Update loading state
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

  getLoginRequets(){
     this.globalservice.getLoginRequets().subscribe(result=>{
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.loginRequests=responsedata.data;
      }  
     });
     
  }

  acceptRequest(emailid:string){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept !"
    }).then((result) => {
      if (result.isConfirmed) {
        this.globalservice.acceptLoginRequest(emailid).subscribe(result=>{
          const responsedata=JSON.parse(JSON.stringify(result));
          if(responsedata.status==200){
            Swal.fire({
              title: "Accepted!",
              text: "User accepted successfully",
              icon: "success"
            });
            this.getLoginRequets();
            this.sendEmail(emailid);
            this.loading = false;
            setTimeout(() => {
              window.location.reload();
            }, 1000); // 1 second = 1000 milliseconds
          }
         })        
      }
    });
     
  }

  declineRequest(emailid: any, firstname: any): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, decline!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true; // Start loader
        this.globalservice.declineRequest(emailid, firstname).subscribe({
          next: (result) => {
            const responsedata = JSON.parse(JSON.stringify(result));
            if (responsedata.status === 200) {
              this.declineStatus = responsedata.data;
              Swal.fire({
                title: "Declined!",
                text: "User request declined",
                icon: "success"
              });
            }
            this.getLoginRequets();
            setTimeout(() => {
              window.location.reload();
            }, 1000); // 1 second = 1000 milliseconds
          },
          error: (error) => {
            console.error("Error occurred while declining request:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to decline user request. Please try again later.",
              icon: "error"
            });
          },
          complete: () => {
            this.loading = false; // Stop loader after API call completes
          }
        });
      }
    });
  }

  sendEmail(emailid:any){
    this.globalservice.sendEmail(emailid).subscribe(result=>{
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.loginRequests=responsedata.data;
      }
     });
      
  }

 
 
}
