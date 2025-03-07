import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useSearchFilter } from '../search-filter.signal';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-as-approved-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './as-approved-questions.component.html',
  styleUrl: './as-approved-questions.component.css'
})
export class AsApprovedQuestionsComponent implements OnInit{
  searchText: string = '';


  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
    }
  }
  
  tableData = [
    { 
      srNo: 1, 
      topic: '01',
      subTopic: '0203',
      questionType:'image',
      answerType:'text',
      variatioNo:'102',
      dod:'5',
      contributorId: '002',
      date:"20-09-2024"
    },
  ];
  searchSignal = useSearchFilter(this.tableData);

  updateSearchText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSignal.searchText.set(input.value);
  }

}
