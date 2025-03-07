import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useSearchFilter } from '../search-filter.signal';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sol-approved',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './sol-approved.component.html',
  styleUrl: './sol-approved.component.css'
})
export class SolApprovedComponent implements OnInit{
  searchText: string = '';
  queForm!: FormGroup;
  emailid = localStorage.getItem('emailid');
  queid: any;
  selectedQue: any;
  questionType: any;
  topics: any;
  subtopics: any;
  approvedQue: any;
  filteredQue: any[] = []; 
  diplayfile: number=0;
  filename: any;
  filePath: string="";
  constructor(private el: ElementRef, private renderer: Renderer2, private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) {
    
  }
  ngOnInit(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
    }
    this.getAllTopics();
    this.intilizeQuestionFromGroup();
    this.getApprovedByAssesorQuestions();
  }

  updateSearchText(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchText = input;
    this.applyFilter();
  }

  
  itemsPerPage: number = 10; // Set number of rows per page
  p: number = 1; // Current page number
  paginatedQue: any[] = []; // Store paginated data
  
  // Apply pagination
  paginateData() {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedQue = this.filteredQue.slice(startIndex, endIndex);
  }
  
  // Change page method
  changePage(newPage: number) {
    this.p = newPage;
    this.paginateData();
  }
  
  // Get total number of pages
  get totalPages(): number {
    return Math.ceil(this.filteredQue.length / this.itemsPerPage);
  }


  applyFilter() {
    this.filteredQue = this.approvedQue.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );

    this.p = 1;
    this.paginateData();
  }

  answerTypes = [
    { id: '1', name: 'Singular Correct Answer' },
    { id: '2', name: 'Fill In The Blanks' },
    { id: '3', name: 'Match the Pairs' },
    { id: '4', name: 'True or False' },
    { id: '5', name: 'Multiple Correct Answers' },
    { id: '6', name: 'Image - Singular Correct Answer' },
    { id: '7', name: 'Image - Match the Pairs' },
    { id: '8', name: 'Image - Multiple Correct Answers' }
  ];

  questionTypes: string[] = [
    'text',
    'audio',
    'video',
    'image'
  ];

  intilizeQuestionFromGroup() {
    this.queForm = this.fb.group({
      topicno: ['', Validators.required],
      subtopicno: ['', Validators.required],
      varno: ['', Validators.required],
      dod: ['', Validators.required],
      answertype: ['', Validators.required],
      quetype: ['', Validators.required],
      time: ['', Validators.required],
      question: ['', Validators.required],
      solution: ['', Validators.required],
      correctanswer1: ['', Validators.required],
      correctanswer2: [''],
      correctanswer3: [''],
      wronganswer1: [''],
      wronganswer2: [''],
      wronganswer3: [''],
      wronganswer4: [''],
      wronganswer5: [''],
      wronganswer6: [''],
      assesoremailid: [this.emailid],
      filename: [''],
      filepath: [''],
      contributoremailid: [''],
      uploadeddatebycontributor: [''],
      oldquestionid: [''],
      comment:[''],
      approveddate:[''],
      solutiondesigneremailid:['']
    })
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

  closeFile() {
    this.diplayfile = 0;
  }

  showfile() {
    this.diplayfile = 1;
    console.log(this.diplayfile,'this.diplayfile');
  }
  

  getApprovedByAssesorQuestions() {
    this.globalservice.getApprovedByAssesorForSolutionProvider(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.approvedQue = responsedata.data;
      this.filteredQue = responsedata.data;
      this.paginateData();
    })
  }

  getReadyForCodingQuestionById(id:any){
    this.queid=id;
    this.globalservice.getApprovedByAssesorById(id).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.selectedQue = responsedata.data; 

      this.queForm.patchValue(this.selectedQue); // Requires all form controls to be present in the data object
      this.questionType = this.selectedQue.quetype;

       this.filename=this.selectedQue.filename;
        this.filePath = `${environment.fileurl}${this.filename}`;
        this.queForm.patchValue({
          contributoremailid: this.selectedQue.contributoremailid,
        });

        this.queForm.patchValue({
          topicno: this.selectedQue.topicno,
        });

        this.queForm.patchValue({
          uploadeddatebycontributor: this.selectedQue.uploadeddatebycontributor,
        });

        this.getSubTopics(this.selectedQue.topicno);

        this.queForm.patchValue({
          subtopicno: this.selectedQue.subtopicno,
        });

        this.setValue();
    })


    
  }

  getAllTopics() {
    this.globalservice.getAllTopics().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.topics = responsedata.data;
      }
    })
  }

  getSubTopics(topicno: any) {
    this.globalservice.getSubTopics(topicno).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.subtopics = responsedata.data;
      }
    })
  }


  setValue() {
    this.queForm.get('topicno')?.disable(); // Disable the input field
    this.queForm.get('subtopicno')?.disable();
    this.queForm.get('varno')?.disable();
    this.queForm.get('dod')?.disable();
    this.queForm.get('answertype')?.disable();
    this.queForm.get('quetype')?.disable();
    this.queForm.get('question')?.disable();
    this.queForm.get('solution')?.disable();
    this.queForm.get('correctanswer1')?.disable();
    this.queForm.get('correctanswer2')?.disable();
    this.queForm.get('correctanswer3')?.disable();
    this.queForm.get('wronganswer1')?.disable();
    this.queForm.get('wronganswer2')?.disable();
    this.queForm.get('wronganswer3')?.disable();
    this.queForm.get('wronganswer4')?.disable();
    this.queForm.get('wronganswer5')?.disable();
    this.queForm.get('wronganswer6')?.disable();
    this.queForm.get('time')?.disable();
    this.queForm.get('comment')?.disable();
    this.queForm.get('contributoremailid')?.disable();
    this.queForm.get('uploadeddatebycontributor')?.disable();
    this.queForm.get('solutiondesigneremailid')?.disable();
    this.queForm.get('approveddate')?.disable();
    this.queForm.get('assesoremailid')?.disable();
  }

}