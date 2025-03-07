import { Component } from '@angular/core';
import { useSearchFilter } from '../search-filter.signal'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approved-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approved-questions.component.html',
  styleUrl: './approved-questions.component.css'
})
export class ApprovedQuestionsComponent {
  searchText: string = '';

  tableData = [
    { 
      srNo: 1, 
      question: 'What is the capital of France? It sounds like you re asking for icon suggestions for the following categories in Bootstrap 5. Here are appropriate Bootstrap Icons for each', 
      solution: 'The capital of France is Paris.', 
      correctAns: 'Paris', 
      wrongAns: 'London, Berlin, Madrid', 
      uplodedDate: '01-09-2024',
      approvedDate: '01-09-2024'  
    },
    { 
      srNo: 2, 
      question: 'What is the largest planet in the solar system?', 
      solution: 'The largest planet is Jupiter.', 
      correctAns: 'Jupiter', 
      wrongAns: 'Earth, Mars, Venus', 
      uplodedDate: '01-09-2024',
      approvedDate: '01-09-2024'  
    },
  ];

  searchSignal = useSearchFilter(this.tableData);

  updateSearchText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSignal.searchText.set(input.value);
  }
}
