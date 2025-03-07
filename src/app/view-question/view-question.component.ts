import { Component } from '@angular/core';
import { useSearchFilter } from '../search-filter.signal'; 
import { CommonModule } from '@angular/common';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-view-question',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './view-question.component.html',
  styleUrl: './view-question.component.css'
})
export class ViewQuestionComponent {
  searchText: string = '';
  allContributorQue: any;
  queForm: any;
  filename: any;
  oldquestionid: any;
  ContributorQue: any;
  questionType: any;
  filePath: SafeResourceUrl | undefined;
  selectedTopicId: any;
  diplayfile: number =0;
  topics: any;
  queuploadedtype: any;

  
  filteredQue: any[] = [];  // Filtered data
  //searchText: string = '';  // Search input text
  


  constructor(private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder,private sanitizer: DomSanitizer) { }
  emailid = localStorage.getItem('emailid');
  ngOnInit(): void {
    this.getAllContributorQue();
    this.intilizeQuestionFromGroup();
    this.getAllTopics();
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

  updateSearchText(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchText = input;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredQue = this.allContributorQue.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
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
      oldquestionid: ['']
    })
  }
  

 

  getAllContributorQue() {
    this.globalservice.getQuestions(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.allContributorQue = responsedata.data;
        this.filteredQue = responsedata.data;
        this.paginateData();
      }
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
  

  getContributorQue(id: any) {
    this.oldquestionid = id;
    this.globalservice.getContributorQue(id).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.ContributorQue = responsedata.data;
        this.queForm.patchValue(this.ContributorQue); // Requires all form controls to be present in the data object
        this.questionType = this.ContributorQue.quetype;
        this.filename=this.ContributorQue.filename;
        this.filePath = `${environment.fileurl}${this.filename}`;
        console.log(this.filePath,'file path');
   //     this.filename=this.ContributorQue.quefilename;
        this.queuploadedtype=this.ContributorQue.quetype;
        this.queForm.patchValue({
          filename: this.filename,
        });

        this.queForm.patchValue({
          contributoremailid: this.ContributorQue.emailid,
        });

        this.queForm.patchValue({
          topicno: this.ContributorQue.topicno,
        });

        this.queForm.patchValue({
          uploadeddatebycontributor: this.ContributorQue.uploadeddatebycontributor,
        });
        this.selectedTopicId =this.ContributorQue.topicno;
        //this.getSubTopics(this.ContributorQue.topicno);
      }
    })
    this.setValue();

  }

  setValue() {
    this.queForm.get('topicno')?.disable(); // Disable the input field
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
  }
  closeFile() {
    this.diplayfile = 0;
  }

  showfile() {
    this.diplayfile = 1;
    console.log(this.diplayfile,'this.diplayfile');
  }
  
}
