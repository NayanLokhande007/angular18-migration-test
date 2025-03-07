import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js'; // Import ChartType
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { CommonModule } from '@angular/common';

Chart.register(...registerables)

@Component({
  selector: 'app-ad-programmer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-programmer-profile.component.html',
  styleUrl: './ad-programmer-profile.component.css'
})
export class AdProgrammerProfileComponent {
  data: any;
  options: any;
  programmerDetails: any;
  totalAssigned: any;
  approved: any;
  pending: any;
  moderated: any;
  graphvalues: any;
  currentMonth: any;
  currentYear: any;
  programmermonthwiseDetails: any;
  currentDay: any;
  currentDate: any;
  performance: number=0;
  circularChart: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { 
    this.getProgrammerWorkDetails();
  }

  emailid=localStorage.getItem('selectedemailid');
  firstname=localStorage.getItem('selectedfirstname');
  lastname=localStorage.getItem('selectedlastname');


  ngOnInit(): void {
    this.updateDay();
    this.getProgrammerWorkDetails();
    this.RenderBarChart('myBarChart', 'bar');
    this.RenderCircularProgressBar('circularProgress',  this.performance);
    console.log(this.performance,'this.performance in ngoninit');
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
  
  getProgrammerWorkDetails() {
    this.globalservice.getProgrammerWorkDetails(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.programmerDetails = responsedata.data;
        this.totalAssigned = this.programmerDetails.overallassigned;
        this.approved = this.programmerDetails.completed;
        this.pending = this.programmerDetails.pending;
        this.moderated = this.programmerDetails.moderated;
        this.performance = this.programmerDetails.overallperformance;
  
        console.log(this.performance, 'this.performance');
        
        // Call RenderCircularProgressBar after performance is updated
        this.RenderCircularProgressBar('circularProgress', this.performance);
      }
    });
  }

  RenderBarChart(chartid: string, charttype: any) {
    // Fetch the month-wise approved variations count
    this.globalservice.getMonthWiseApprovedVaritionsCount(this.emailid, this.currentYear).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.programmermonthwiseDetails = responsedata.data;
        console.log(this.programmermonthwiseDetails, ' this.programmermonthwiseDetails');

        this.graphvalues = Array(12).fill(0); // Ensure the array has 12 elements initially (for each month)
  
        // Iterate over the month data and assign values
        Object.keys(this.programmermonthwiseDetails).forEach(month => {
          const count = this.programmermonthwiseDetails[month];
          
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
  
        console.log(this.graphvalues, 'graph values');
  
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
 

  RenderCircularProgressBar(chartid: string, progress: number) {
    const ctx = document.getElementById(chartid) as HTMLCanvasElement;

    // Destroy existing chart instance if it exists
    if (this.circularChart) {
      this.circularChart.destroy();
    }

    // Create a new chart instance and store it
    this.circularChart = new Chart(ctx, {
      type: 'doughnut', // Use doughnut chart for circular progress
      data: {
        labels: ['Completed', 'Remaining'], // Labels for the segments
        datasets: [
          {
            data: [progress, 100 - progress], // Completed and remaining percentages
            backgroundColor: ['#4caf50', '#e0e0e0'], // Colors for segments
            borderWidth: 0 // No border
          }
        ]
      },
      options: {
        responsive: true,
        cutout: '70%', // Create a donut hole
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                return `${label}: ${value}%`; // Show percentage in tooltip
              }
            }
          },
          legend: {
            display: false // Hide the legend for a cleaner look
          },
          title: {
            display: true,
            text: ` Performance ${progress}% `, // Display progress as a title inside the chart
            color: '#000',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    });
  }
}
