import { Component } from '@angular/core';
import { useSearchFilter } from '../search-filter.signal'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-status.component.html',
  styleUrl: './upload-status.component.css'
})
export class UploadStatusComponent {
  searchText: string = '';

  tableData = [
    { srNo: 1, topic: '01', subTopic: '0101', variation: '102', dod: '004', question: '28-08-2024', solution: 'xyz' },
    { srNo: 2, topic: '04', subTopic: '0304', variation: '105', dod: '002', question: '29-08-2024', solution: 'abc' },
    // More data here...
  ];

  searchSignal = useSearchFilter(this.tableData);

  updateSearchText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSignal.searchText.set(input.value);
  }
}
