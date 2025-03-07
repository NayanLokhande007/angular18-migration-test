import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {
  }

  firstname = localStorage.getItem('firstname');
  lastname = localStorage.getItem('lastname');
  usertype = localStorage.getItem('usertype');
  userRole: any = "";

  ngOnInit(): void {
    if (this.usertype == '1') {
      this.userRole = 'Contributor'
    } else if (this.usertype == '2') {
      this.userRole = 'Assesor'
    } else if (this.usertype == '3') {
      this.userRole = 'Solution Provider'
    } else if (this.usertype == '4') {
      this.userRole = 'Programmer'
    } else if (this.usertype == '5') {
      this.userRole = 'Approver'
    } else if (this.usertype == '6') {
      this.userRole = 'Moderator'
    } else {
      this.userRole = 'Admin'
    }
  }

  gotoProfile() {
    this.router.navigate(['/profile']);
  }


  isProfileMenuOpen = false;

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
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

  @HostListener('document:click')
  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }
  
}
