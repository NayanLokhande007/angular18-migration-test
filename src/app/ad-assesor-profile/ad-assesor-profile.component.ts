import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js'; // Import ChartType
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-assesor-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-assesor-profile.component.html',
  styleUrl: './ad-assesor-profile.component.css'
})
export class AdAssesorProfileComponent {
  data: any;
  options: any;
  assesorDetails: any;
  totalAssigned: any;
  approved: any;
  pending: any;
  currentDay: any;
  currentDate: any;
  currentMonth: any;
  currentYear: any;
  graphvalues: any[]=[];
  assesormonthwiseDetails: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { 
    this.updateDay();
    this.getAssesorWorkDetails();
    this.RenderBarChart('myBarChart', 'bar');
  }
  emailid=localStorage.getItem('selectedemailid');
  firstname=localStorage.getItem('selectedfirstname');
  lastname=localStorage.getItem('selectedlastname');

  ngOnInit(): void {
    this.updateDay();
    this.getAssesorWorkDetails();
    this.RenderBarChart('myBarChart', 'bar');
  }

  gotoEmplist(){
    this.router.navigate(['/emp-list']);
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
  }

  getAssesorWorkDetails() {
    this.globalservice.getAssesorWorkDetails(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.assesorDetails = responsedata.data;
        this.totalAssigned= this.assesorDetails.total;
        this.approved=this.assesorDetails.completed;
        this.pending=this.assesorDetails.currentlyassigned;
      }
    })
  }

  RenderBarChart(chartid: string, charttype: any) {
    // Fetch the month-wise approved variations count
    console.log(this.currentYear,'this.currentYear');
    this.globalservice.getMonthWiseApprovedVaritionsCountofAssesor(this.emailid, this.currentYear).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.assesormonthwiseDetails = responsedata.data;
        this.graphvalues = Array(12).fill(0); // Ensure the array has 12 elements initially (for each month)
        // Iterate over the month data and assign values
        Object.keys(this.assesormonthwiseDetails).forEach(month => {
          const count = this.assesormonthwiseDetails[month];
          
          // Ensure the month index is a number and set count in the right position
          const monthIndex = parseInt(month, 10);
          if (!isNaN(monthIndex) && typeof count === 'number') {
            this.graphvalues[monthIndex - 1] = count;
            console.log(`Month: ${month}, Approved Count: ${count}`);
          }
        });
  
        // Now call the RenderBarChart logic after data has been populated in graphvalues
        const labeldata = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
        // Use the updated graphvalues array
        const valuedata = this.graphvalues; // Use the graph values populated from the API
        const ctx = document.getElementById(chartid) as HTMLCanvasElement;
        const myChart = new Chart(ctx, {
          type: charttype,
          data: {
            labels: labeldata,
            datasets: [{
              label: 'Assignment Status',
              data: valuedata,
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
                max: 30, // Set the maximum value of the y-axis
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
                    size: 14, // Set font size for x-axis labels (labeldata)
                    weight: '600'
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
    });
  }

}
