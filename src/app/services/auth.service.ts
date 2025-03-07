import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false; // Adjust based on your actual logic

  isAuthenticated(): boolean {
   if(localStorage.length === 0){
    return true;
   }else{
    return true;
   }
  }
}
