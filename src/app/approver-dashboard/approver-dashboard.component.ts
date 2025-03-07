import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
Chart.register(...registerables)

@Component({
  selector: 'app-approver-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approver-dashboard.component.html',
  styleUrl: './approver-dashboard.component.css'
})
export class ApproverDashboardComponent {
data:any;
options:any;
  approverDetails: any;
  totalAssigned: number=0;
  approverDetails1: any;
  approved: number=0;
  pending:number=0;
  currentDay: any;
  currentDate: any;
  currentMonth: any;
  currentYear: any;
  approvermonthwiseDetails: any;
  graphvalues: any[]=[];

  currentyear: number = new Date().getFullYear(); // Default to the current year
  availableYears: number[] = []; // Years to display in the dropdown
  chartInstance: any;
  selectedYear: any;
  pendingDetails1: any;
  moderationDetails: any;
  moderated: number=0;

constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { this.getTotalAssignedQuestionsByApprover(); }
emailid = localStorage.getItem('emailid');

ngOnInit(): void {
  this.updateDay();
  this.populateAvailableYears();
  this.RenderBarChart('myBarChart', 'bar');
  this.getTotalAssignedQuestionsByApprover();
  this.getApprovedAssignedQuestionsOfApprover();
  this.getPendingQuestionsOfApprover();
  this.getModeratedQuestionsOfApprover();
}

updateDay(): void {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  this.currentDay = now.toLocaleDateString('en-US', options);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(now.getFullYear()).slice(-2);
  this.currentDate = `${day}/${month}/${year}`;
  this.currentMonth=month;
  this.currentYear=year;
  this.selectedYear=year;
}

populateAvailableYears() {
  // Generate a range of years from 2024 to the current year
  const startYear = 2024;
  const endYear = new Date().getFullYear();
  this.availableYears = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  ).reverse(); // Reverse to show the most recent year first
}

onYearChange(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value; // Cast EventTarget to HTMLSelectElement
  this.currentyear = parseInt(selectedValue, 10); // Update the currentYear
  this.selectedYear=String(this.currentyear).slice(-2);
  this.RenderBarChart('myBarChart', 'bar');
 
}
  
getTotalAssignedQuestionsByApprover(){
  this.globalservice.getTotalAssignedQuestionsByApprover(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.approverDetails = responsedata.data;
      this.totalAssigned= this.approverDetails.length ;    
    }
  })
}

getApprovedAssignedQuestionsOfApprover(){
  this.globalservice.getApprovedAssignedQuestionsOfApprover(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.approverDetails1 = responsedata.data;
      this.approved= this.approverDetails1.length ;
    }
  })
}

getPendingQuestionsOfApprover(){
  this.globalservice.getPendingQuestionsOfApprover(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.pendingDetails1 = responsedata.data;
      this.pending= this.pendingDetails1;
    }
  })
}

getModeratedQuestionsOfApprover(){
  this.globalservice.getModeratedQuestionsOfApprover(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.moderationDetails = responsedata.data;
      this.moderated= this.moderationDetails.length;
    }
  })
}

RenderBarChart(chartid: string, charttype: any) {
  // Fetch the month-wise approved variations count
  this.globalservice.getMonthWiseApprovedVaritionsCountOfApprover(this.emailid, this.selectedYear).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.approvermonthwiseDetails = responsedata.data;
      this.graphvalues = Array(12).fill(0); // Ensure the array has 12 elements initially (for each month)

      // Iterate over the month data and assign values
      Object.keys(this.approvermonthwiseDetails).forEach(month => {
        const count = this.approvermonthwiseDetails[month];
        
        // Ensure the month index is a number and set count in the right position
        const monthIndex = parseInt(month, 10);
        if (!isNaN(monthIndex) && typeof count === 'number') {
          this.graphvalues[monthIndex - 1] = count;
        }
      });

      // Now call the RenderBarChart logic after data has been populated in graphvalues
      const labeldata = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      // Use the updated graphvalues array
      const valuedata = this.graphvalues; // Use the graph values populated from the API
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Create a new chart instance
      const ctx = document.getElementById(chartid) as HTMLCanvasElement;
      if (ctx) {
        this.chartInstance = new Chart(ctx, {
          type: charttype, // Use the correct type from ChartTypeRegistry
          data: {
            labels: labeldata,
            datasets: [{
              label: 'Assignment Status',
              data: this.graphvalues,
              backgroundColor: '#528baf',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 40, // Set the maximum value of the y-axis
                ticks: {
                  font: {
                    size: 14, // Set font size for y-axis labels
                    weight: 'bold'
                  }
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 14, // Set font size for x-axis labels
                    weight: 600
                  }
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 16, // Set font size for legend labels
                    weight: 'bold'
                  }
                }
              }
            }
          }
        });
      }
    }
  });
}
  
  gotoDashboard(){
    this.router.navigate(['/dashboard']);
  }

  gotoWorkStatus(){
    this.router.navigate(['/work-status']);
  }

  gotoEmployeeDetails(){
    this.router.navigate(['/employee-details']);
  }
  gotoLogOut(){
    this.router.navigate(['/login']);
  }
  gotoProfile(){
    this.router.navigate(['/profile']);
  }
}
