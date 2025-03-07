import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js'; // Import ChartType
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';

Chart.register(...registerables)

@Component({
  selector: 'app-ad-moderator-profile',
  standalone: true,
  imports: [],
  templateUrl: './ad-moderator-profile.component.html',
  styleUrl: './ad-moderator-profile.component.css'
})
export class AdModeratorProfileComponent {
  data: any;
  options: any;
  total: any;
  moderated: any;
  pending: any;
  moderatormonthwiseDetails: any;
  graphvalues: any[]=[];

  currentDay: any;
  currentDate: any;
  currentMonth: any;
  currentYear: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { 
    this.getTotalQuestionsOfModerator();
    this.getModeratedQuestionsOfModerator();
    this.getPendingQuestionsOfModerator();
    this.RenderBarChart('myBarChart', 'bar');
  }
      
    
      emailid=localStorage.getItem('selectedemailid');
      firstname=localStorage.getItem('selectedfirstname');
      lastname=localStorage.getItem('selectedlastname');
  

  ngOnInit(): void {
    this.updateDay();
    this.RenderBarChart('myBarChart', 'bar');
    this.RenderCircularProgressBar('circularProgress', 65);
    this.getTotalQuestionsOfModerator();
    this.getModeratedQuestionsOfModerator();
    this.getPendingQuestionsOfModerator();
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

  getTotalQuestionsOfModerator() {
    this.globalservice.getTotalQuestionsOfModerator(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.total = responsedata.data; 
      }
    });
  }

  getModeratedQuestionsOfModerator() {
    this.globalservice.getModeratedQuestionsOfModerator(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.moderated = responsedata.data; 
      }
    });
  }

  getPendingQuestionsOfModerator() {
    this.globalservice.getPendingQuestionsOfModerator(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.pending = responsedata.data; 
      }
    });
  }


  RenderBarChart(chartid: string, charttype: any) {
    // Fetch the month-wise approved variations count
    this.globalservice.getMonthWiseApprovedVaritionsCountOfModerator(this.emailid, this.currentYear).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.moderatormonthwiseDetails = responsedata.data;
        console.log(this.moderatormonthwiseDetails, ' this.programmermonthwiseDetails');

        this.graphvalues = Array(12).fill(0); // Ensure the array has 12 elements initially (for each month)
  
        // Iterate over the month data and assign values
        Object.keys(this.moderatormonthwiseDetails).forEach(month => {
          const count = this.moderatormonthwiseDetails[month];
          
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

    new Chart(ctx, {
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
