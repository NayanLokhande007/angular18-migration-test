import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-drive-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drive-link.component.html',
  styleUrls: ['./drive-link.component.css']
})
export class DriveLinkComponent {
  topics: any[] = []; // Holds all topic data
  tableData: any[] = []; // Holds the entire table data
  filteredTableData: any[] = []; // Data filtered based on selected topic
  selectedTopicNo: any;
  driveLinksData: any;
  driveLinksDataSize: number=0;
  selecttopicclicked: number=0;

  filteredQue: any[] = [];  // Filtered data
  searchText: string = '';  // Search input text


  constructor(private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.getAllTopics();
  }

  itemsPerPage: number = 10; // Set number of rows per page
  p: number = 1; // Current page number
  paginatedQue: any[] = []; // Store paginated data
  
  // Apply pagination
  paginateData() {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedQue = this.filteredQue.slice(startIndex, endIndex);
  }
  
  // Change page method
  changePage(newPage: number) {
    this.p = newPage;
    this.paginateData();
  }
  
  // Get total number of pages
  get totalPages(): number {
    return Math.ceil(this.filteredQue.length / this.itemsPerPage);
  }

  

  getAllTopics() {
    this.globalservice.getAllTopics().subscribe((result: any) => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.topics = responsedata.data;
      }
    })
  }
  selectedTopic(event: any) {
   // this.selecttopicclicked=1;
    this.selectedTopicNo = (event.target as HTMLSelectElement).value;
    this.getDriveLinksByTopic(this.selectedTopicNo)
  }

  getDriveLinksByTopic(topicno: any) {
    console.log(topicno)
    this.globalservice.getDriveLinksByTopic(topicno).subscribe((result: any) => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.driveLinksData = responsedata.data;
        this.filteredQue = responsedata.data;
        this.driveLinksDataSize = this.driveLinksData.length; 
        this.paginateData();
        if(this.driveLinksDataSize>0){
          this.selecttopicclicked=0
        }else{
          this.selecttopicclicked=1;
        }
      }
    })
  }

  updateSearchText(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchText = input;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredQue = this.driveLinksData.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
    this.p = 1;
    this.paginateData();
  }

}
