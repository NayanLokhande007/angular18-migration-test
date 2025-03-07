import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, ChartTypeRegistry, registerables } from 'chart.js'; // Import ChartType
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
Chart.register(...registerables)
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  data: any;
  options: any;

  totalQueDetails: any;
  totalQuestions: number=0;

  currentDay: any;
  currentDate: any;
  currentMonth: any;
  currentYear: any;

  totalApprovedQueDetails: any;
  totalApprovedQuestions: number=0;

  
  totalPendingQueDetails: any;
  totalPendingQuestions: number=0;
  selectedYear: any;
  currentyear: number = new Date().getFullYear(); 
  availableYears: number[] = [];
  monthwiseDetails: any;
  myChart: any;
  moderatedQueDetails: any;
  moderatedQuestions: number=0;
  totalApprovalProcessQueDetails: any;
  getPendingForAssignQuestionsDetails: any;
  getPendingForProgrammingQuestionsDetails: any;
  getTodaysContrinbutedQuestionsDetails: any;
  getTodaysPendingForAssignQuestionsDetails: any;
  getTodaysPendingForProgrammingQuestionsDetails: any;
  todaysPendingModeration: any;
  todaysModeratedQuestions: any;
  graphvalues: any[]=[];
  chartInstance: any;
  monthwiseModerationDetails: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) {
    //this.RenderBarChart1('myBarChart', 'bar');
   }
  emailid = localStorage.getItem('emailid'); 


  ngOnInit(): void {
    this.updateDay();
    this.populateAvailableYears();
    this.getTotalQuestions();
    this.getTotalApprovedQuestions();
    this.getPendingQuestions();
    this.getModeratedQuestions();
    this.getVerticalsInfo();
    this.getOverallApprovalProcessQuestions();
    this.getPendingForAssignQuestions();
    this.getPendingForProgrammingQuestions();
    this.getTodaysContrinbutedQuestions();
    this.getTodaysPendingForAssignQuestions();
    this.getTodaysPendingForProgrammingQuestions();
    this.getTodaysPendingModerationQuestions();
    this.getTodaysModeratedQuestions();
    this.RenderBarChart1('myBarChart1', 'bar');
    this.RenderProgressLineGraph('mylineChart', 'line');
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
    console.log('Selected Year:', this.selectedYear);

    this.RenderProgressLineGraph('mylineChart', 'line');
    // Add logic to update the report based on the selected year
  }
  

  getTotalQuestions(){
    this.globalservice.getTotalQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.totalQueDetails = responsedata.data;
        this.totalQuestions= this.totalQueDetails.length ;
       
      }
    })
  }


  getTotalApprovedQuestions(){
    this.globalservice.getTotalApprovedQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.totalApprovedQueDetails = responsedata.data;
        this.totalApprovedQuestions= this.totalApprovedQueDetails.length ;
      }
    })
  }


  getOverallApprovalProcessQuestions(){
    this.globalservice.getOverallApprovalProcessQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.totalApprovalProcessQueDetails = responsedata.data;
      }
    })
  }

  getPendingForAssignQuestions(){
    this.globalservice.getPendingForAssignQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.getPendingForAssignQuestionsDetails = responsedata.data;
      }
    })
  }

  getPendingForProgrammingQuestions(){
    this.globalservice.getPendingForProgrammingQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.getPendingForProgrammingQuestionsDetails = responsedata.data;
      }
    })
  }


  getTodaysContrinbutedQuestions(){
    this.globalservice.getTodaysContrinbutedQuestions(this.currentDate).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.getTodaysContrinbutedQuestionsDetails = responsedata.data;
      }
    })
  }

  getTodaysPendingForAssignQuestions(){
    this.globalservice.getTodaysPendingForAssignQuestions(this.currentDate).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.getTodaysPendingForAssignQuestionsDetails = responsedata.data;
      }
    })
  }

  getTodaysPendingForProgrammingQuestions(){
    this.globalservice.getTodaysPendingForProgrammingQuestions(this.currentDate).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.getTodaysPendingForProgrammingQuestionsDetails = responsedata.data;
      }
    })
  }

  getTodaysApprovalProcessQuestions(){
    this.globalservice.getOverallApprovalProcessQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.totalApprovalProcessQueDetails = responsedata.data;
      }
    })
  }

  getTodaysPendingModerationQuestions(){
    this.globalservice.getTodaysPendingModerationQuestions(this.currentDate).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.todaysPendingModeration = responsedata.data;
      }
    })
  }

  getTodaysModeratedQuestions(){
    this.globalservice.getTodaysModeratedQuestions(this.currentDate).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.todaysModeratedQuestions = responsedata.data;
      }
    })
  }


  getPendingQuestions(){
    this.globalservice.getPendingQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.totalPendingQueDetails = responsedata.data;
        this.totalPendingQuestions= this.totalPendingQueDetails.length ;
      }
    })
  }

  getModeratedQuestions(){
    this.globalservice.getModeratedQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.moderatedQueDetails = responsedata.data;
        this.moderatedQuestions= this.moderatedQueDetails.length ;
        console.log( this.moderatedQuestions," this.moderatedQuestions");
      }
    })
  }

  getVerticalsInfo(){
    this.globalservice.getVerticalsInfo().subscribe(result => { 
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) { 
        this.RenderBarChart('myBarChart', 'bar', responsedata.data); // Pass API data to chart
      }
    });
    
  }

  RenderBarChart(chartid: string, charttype: ChartType, apiData: any[]) {
    const labeldata = apiData.map(item => item.verticalname); // Vertical names as labels
    const totalData = apiData.map(item => item.total); // Total data from response
    const moderatedData = apiData.map(item => item.moderated); // Moderated data from response
    const remainingData = totalData.map((total, index) => Math.max(0, total - moderatedData[index])); // Remaining work
  
    // Get canvas element
    const ctx = document.getElementById(chartid) as HTMLCanvasElement;
  
    // Destroy existing chart to avoid "canvas is already in use" errors
    if (this.myChart) {
      this.myChart.destroy();
    }
  
    // Create the chart
    this.myChart = new Chart(ctx, {
      type: charttype,
      data: {
        labels: labeldata,
        datasets: [
          {
            label: 'Moderated Work',
            data: moderatedData,
            backgroundColor: '#346888', // Color for moderated work
          },
          {
            label: 'Remaining Work',
            data: remainingData,
            backgroundColor: '#9dc6e0', // Color for remaining work
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        onClick: (event, elements) => {
          if (elements.length > 0) {
            const datasetIndex = elements[0].datasetIndex; // Get dataset index
            let dataIndex = elements[0].index; // Get clicked bar index
            const label = this.myChart.data.labels[dataIndex]; // Get label name
        
            console.log(`Clicked on: ${label} (Dataset: ${datasetIndex})`);
        
            // Convert to 1-based index
            dataIndex = dataIndex + 1;
        
            // Store in localStorage as a string
            localStorage.setItem('selectedVertical', String(dataIndex));
        
            // Navigate to another page
            this.router.navigate(['/vertical-dashboard']);
          } else {
            console.log('No bar clicked. Try clicking on a larger area.');
          }
        
        },

        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const rawValue = context.raw as number;
                return `${rawValue}`; // Show value without decimals
              }
            }
          },
          legend: {
            labels: {
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            title: {
              display: true,
              text: 'Verticals'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1, // Ensure Y-axis increments by 1
              callback: (value) => `${value}`, // Display integer values only
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            title: {
              display: true,
              text: 'Moderated Variations Count'
            },
          }
        }
      }
    });
  }
  
  
  
  RenderProgressLineGraph(chartid: string, charttype: ChartType) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]; // Labels for the X-axis (months)
  
    // A variable to store the chart instance
    if (this.myChart) {
      this.myChart.destroy(); // Destroy the existing chart instance before creating a new one
    }
  
    // Fetch data from the service dynamically
    this.globalservice.getMonthWiseModeratedVaritionsCount(this.selectedYear).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status === 200) {
        const rawData = responsedata.data;
  
        // Initialize completedWork array with zeros
        const completedWork = Array(12).fill(0);
  
        // Populate completedWork array with values from the response
        Object.keys(rawData).forEach((key) => {
          const monthIndex = parseInt(key, 10) - 1; // Convert month number (1-12) to array index (0-11)
          completedWork[monthIndex] = rawData[key];
        });
  
        // Create the chart
        const ctx = document.getElementById(chartid) as HTMLCanvasElement;
        this.myChart = new Chart(ctx, {
          type: charttype, // Line chart
          data: {
            labels: months, // X-axis labels
            datasets: [
              {
                label: 'Moderated Variations Count',
                data: completedWork, // Data for completed work per month
                borderColor: '#346888', // Line color
                backgroundColor: '#9dc6e0', // Fill color under the line
                borderWidth: 3,
                tension: 0.4, // Smooth the line
                fill: true // Fill area under the line
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const rawValue = context.raw as number; // Cast to number
                    return `${rawValue} variations`; // Show the number of units completed
                  }
                }
              },
              legend: {
                labels: {
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Months'
                },
                ticks: {
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                },
                grid: {
                  display: true // Ensure grid lines are shown even with zero data
                }
              },
              y: {
                beginAtZero: true, // Ensure the Y-axis starts at zero
                ticks: {
                  stepSize: 1, // Enforce steps of 1 to show only integer values
                  callback: (value) => `${value}`, // Display integer values
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                },
                title: {
                  display: true,
                  text: 'Moderated Variations Count'
                },
                grid: {
                  display: true // Ensure grid lines are shown even with zero data
                }
              }
            }
          }
        });
      }
    });
  }


  RenderBarChart1(chartid: string, charttype: keyof ChartTypeRegistry) {
    this.globalservice.getMonthWiseModeratedVaritionsCount(this.selectedYear).subscribe(result => {
        const responsedata = JSON.parse(JSON.stringify(result));
        if (responsedata.status === 200) {
          this.monthwiseModerationDetails = responsedata.data;
    
          // Reset graph values to ensure correct data rendering
          this.graphvalues = Array(12).fill(0);
    
          // Populate graphvalues with data from API response
          Object.keys(this.monthwiseModerationDetails).forEach(month => {
            const count = this.monthwiseModerationDetails[month];
            const monthIndex = parseInt(month, 10);
            if (!isNaN(monthIndex) && typeof count === 'number') {
              this.graphvalues[monthIndex - 1] = count;
            }
          });
    
          // Chart labels for each month
          const labeldata = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
          // Destroy the previous chart instance, if it exists
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
  
}
