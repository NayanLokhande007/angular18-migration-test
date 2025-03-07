import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-verticals-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verticals-dashboard.component.html',
  styleUrl: './verticals-dashboard.component.css'
})
export class VerticalsDashboardComponent implements AfterViewInit {
  private myChart: Chart | null = null;
  graphvalues: any[]=[];
  chartInstance: any;
  selectedVertical=localStorage.getItem('selectedVertical');
  totalQuestions: number=0;
  verticalDetails: any;
  availableYears: number[] = [];

  verticalNames: string[] = [
    "",
    "Numbers",
    "Int&Fractions",
    "Algebra",
    "Geometry",
    "Co-Geometry",
    "Trignometry",
    "Com. Maths",
    "Mesure&Mensu",
    "Data Handling",
    "Probabilty",
    "AP",
    "Sets"
  ];
  verticalName: any;
  selectedVerticalIndex: number=0;
  moderated: any;
  monthwiseModerationDetails: any;
  currentDay: any;
  currentDate: any;
  currentMonth: any;
  currentYear: any;
  selectedYear: any;
  currentyear: number = new Date().getFullYear(); 
  

   constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) {
      this.selectedVertical=localStorage.getItem('selectedVertical');
      this.selectedVerticalIndex = Number(localStorage.getItem('selectedVertical')); // Convert to number
      this.verticalName = this.verticalNames[this.selectedVerticalIndex];

      this.getVerticalDetails();
     }

  ngOnInit(): void {
    this.selectedVertical=localStorage.getItem('selectedVertical');
    this.updateDay();
    this.populateAvailableYears();
    this.getVerticalDetails();
    this.getModeratedCountOfVertical();
    this.RenderBarChart('myBarChart', 'bar'); // 'bar' for bar chart type
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

  onYearChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value; // Cast EventTarget to HTMLSelectElement
    this.currentyear = parseInt(selectedValue, 10); // Update the currentYear
    this.selectedYear=String(this.currentyear).slice(-2);
    console.log('Selected Year:', this.selectedYear);

    this.RenderBarChart('myBarChart', 'bar'); // 'bar' for bar chart type
    // Add logic to update the report based on the selected year
  }
  

  ngAfterViewInit() {
    this.RenderSingleProgressBar('myProgressChart', 65); // Example: 75% progress
  }

  getVerticalDetails(){
    this.globalservice.getVerticalDetails(this.selectedVertical).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.verticalDetails = responsedata.data;
        this.totalQuestions=this.verticalDetails.total;
      }
    })
  }

  getModeratedCountOfVertical(){
    this.globalservice.getModeratedCountOfVertical(this.selectedVertical).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.moderated = responsedata.data;
      }
    })
  }

  RenderSingleProgressBar(chartid: string, progressValue: number) {
    if (this.myChart) {
        this.myChart.destroy();
    }

    const ctx = document.getElementById(chartid) as HTMLCanvasElement;

    this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Progress'],
            datasets: [
                {
                    label: 'Total', // Background bar
                    data: [100], // Full bar (100%)
                    backgroundColor: '#55CEFF', // Light gray background
                    borderRadius: 1,
                    barThickness: 50
                },
                {
                    label: 'Completed', // Progress fill
                    data: [progressValue], // Filled portion
                    backgroundColor: '#346888', // Blue (progress)
                    borderRadius:1,
                    barThickness: 50
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Horizontal bar
            plugins: {
                tooltip: { enabled: false }, // Disable tooltip
                datalabels: {
                    anchor: 'center',
                    align: 'center',
                    color: 'white',
                    font: { weight: 'bold', size: 16 },
                    formatter: (value: any) => `${value}` // Show percentage inside the bar
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 100, // Full width
                    grid: { display: false },
                    ticks: { display: false }
                },
                y: { display: false }
            }
        }
    });
}


RenderBarChart(chartid: string, charttype: keyof ChartTypeRegistry) {
  this.globalservice.getMonthWiseModeratedVaritionsCountOfVerticals(this.selectedVertical,this.selectedYear).subscribe(result => {
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
