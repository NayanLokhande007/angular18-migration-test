import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ap-assigned-que',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ap-assigned-que.component.html',
  styleUrl: './ap-assigned-que.component.css'
})
export class ApAssignedQueComponent {
  assigned: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { }

  emailid = localStorage.getItem('emailid');

  filteredQue: any[] = [];  // Filtered data
  searchText: string = '';  // Search input text

  ngOnInit(): void {
    this.getAssignedQuestionsNosendforapproval();
  }
  getAssignedQuestionsNosendforapproval() {
    this.globalservice.getAssignedQuestionsNosendforapproval(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.assigned = responsedata.data;
        this.filteredQue = responsedata.data;
      }
    })
  }

  updateSearchText(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchText = input;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredQue = this.assigned.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

}
