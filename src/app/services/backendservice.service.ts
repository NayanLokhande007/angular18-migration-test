import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BackendserviceService {

  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();
  
   jsonData = {
    emailId: "xyz@gmail.com",
    firstName: "Ayush",
    lastName: "Aher",
    assignedAssign: 20,
    compAssign: 10,
    startDate: "29-05-2024",
    currentDate: "25-06-2024"
  };

   jsonString: string = JSON.stringify(this.jsonData);;

  constructor(private http: HttpClient) { }

  Login(data:any){

    this.loadingSubject.next(true); // Show loader
    const loginData= {
      emailid: data.username,
      password:data.password,  
    };
    console.log(loginData,'loginData');
    const params = new HttpParams()
    .set('emailid', data.username)
    .set('password', data.password);
    
    console.log(loginData,'-------------------------');
    const jsonString = JSON.stringify(loginData);

    // return this.http.get<any>(`${this.apiUrl}/login`, { params }).pipe(
    //   finalize(() => this.loadingSubject.next(false)) // Hide loader
    // );
    
    return this.http.get<any>(`${environment.authUrl}/login`, { params });
  }
}
