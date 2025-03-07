import { Component, OnInit } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { CommonModule } from '@angular/common';
Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  data: any;
  options: any;
  programmerDetails: any;
  totalAssigned: any;
  approved: any;
  pending: any;
  moderated: any;
  currentDay: any;
  currentDate: any;
  currentMonth: any;
  currentYear: any;
  programmermonthwiseDetails: any;

  graphvalues: any[]=[];
  selectedYear:any;

  currentyear: number = new Date().getFullYear(); // Default to the current year
  availableYears: number[] = []; // Years to display in the dropdown
  chartInstance: any;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) { }

  emailid = localStorage.getItem('emailid');

  ngOnInit(): void {
    this.updateDay(); 
    this.populateAvailableYears();
    this.getProgrammerWorkDetails();
    this.RenderBarChart('myBarChart', 'bar');
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

  getProgrammerWorkDetails() {
    this.globalservice.getProgrammerWorkDetails(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.programmerDetails = responsedata.data;
        this.totalAssigned= this.programmerDetails.overallassigned;
        this.approved=this.programmerDetails.completed;
        this.pending=this.programmerDetails.pending;
        this.moderated=this.programmerDetails.moderated;
      }
    })
  }

  RenderBarChart(chartid: string, charttype: keyof ChartTypeRegistry) {
    this.globalservice.getMonthWiseApprovedVaritionsCount(this.emailid, this.selectedYear).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status === 200) {
        this.programmermonthwiseDetails = responsedata.data;
  
        // Reset graph values to ensure correct data rendering
        this.graphvalues = Array(12).fill(0);
  
        // Populate graphvalues with data from API response
        Object.keys(this.programmermonthwiseDetails).forEach(month => {
          const count = this.programmermonthwiseDetails[month];
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