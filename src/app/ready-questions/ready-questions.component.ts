
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useSearchFilter } from '../search-filter.signal';
import * as bootstrap from 'bootstrap';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from "../loader/loader.component";
import { AssignedVariationsComponent } from '../assigned-variations/assigned-variations.component';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-ready-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './ready-questions.component.html',
  styleUrl: './ready-questions.component.css'
})
export class ReadyQuestionsComponent {

  @ViewChild(AssignedVariationsComponent) assignedVariationsComponent!: AssignedVariationsComponent;

  loading: boolean = false;
  searchText: string = '';
  approvedQue: any;
  queForm!: FormGroup;
  emailid = localStorage.getItem('emailid');
  queid: any;
  selectedQue: any;
  questionType: any;
  topics: any;
  subtopics: any;
  programmers: any;
  assignedQuestions: any;
  responsefrom: number = 2;
  selectedprogrammer: any = 1;
  currentDay: string | undefined;
  currentDate: string | undefined;
  assignclicked: number = 0;

  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button
  diplayfile: number=0;
  filename: any;
  filePath: string="";
  ngAfterViewInit() {
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) {

  }
  ngOnInit(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
    }
    this.getAllTopics();
    this.intilizeQuestionFromGroup();
    this.getReadyQuestions();
    this.updateDay();
  }

  updateDay(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    this.currentDay = now.toLocaleDateString('en-US', options);
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(now.getFullYear()).slice(-2);
    this.currentDate = `${day}/${month}/${year}`;
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

  closeFile() {
    this.diplayfile = 0;
  }

  showfile() {
    this.diplayfile = 1;
    console.log(this.diplayfile,'this.diplayfile');
  }

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
      filename: [''],
      filepath: [''],
      oldquestionid: [''],
      comment: [''],
      approveddate: [''],
      solutiondesigneremailid: [''],
      approveremailid:[''],
      assigndate:[''],
    })
  }

  tableData = [
    {
      srNo: 1,
      topic: '01',
      subTopic: '0203',
      questionType: 'image',
      answerType: 'text',
      variatioNo: '102',
      dod: '5',
      contributorId: '002',
      date: "20-09-2024"
    },
  ];
  searchSignal = useSearchFilter(this.tableData);

  updateSearchText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSignal.searchText.set(input.value);
  }

  getReadyQuestions() {
    this.globalservice.getReadyQuestions().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.approvedQue = responsedata.data;
    })
  }

  getReadyForCodingQuestionById(id: any) {
    this.queid = id;
    this.globalservice.getReadyForCodingQuestionById(id).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.selectedQue = responsedata.data;

      this.filename=this.selectedQue.filename;
      this.filePath = `${environment.fileurl}${this.filename}`;

      this.queForm.patchValue(this.selectedQue); // Requires all form controls to be present in the data object
      this.questionType = this.selectedQue.quetype;
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
      this.getProgrammers();
    })
  }

  getProgrammers() {
    this.globalservice.getProgrammers().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.programmers = responsedata.data;
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
  }

  selectedProgrammer(emailid: any) {
    this.selectedprogrammer = emailid;
  }

  assignQuestionToProgrammer() {
    if (this.selectedprogrammer == 1) {
      this.assignclicked = 0;
      Swal.fire({
        toast: true,
        title: "Assign programmer first",
        icon: "error",
        position: 'top-right',
        showConfirmButton: false,
      });
    } else {
      this.assignclicked = 1;
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, assign !"
      }).then((result) => {
        if (result.isConfirmed) {
          this.globalservice.assignQuestionToProgrammer(this.queid, this.selectedprogrammer, this.currentDate,this.emailid).subscribe(result => {
            const responsedata = JSON.parse(JSON.stringify(result));
            if (responsedata.status == 200) {
              Swal.fire({
                title: "Assigned!",
                text: "Variation assigned successfully",
                icon: "success",
                timer: 2000, // Auto-close after 1 second
                showConfirmButton: false, // Hide the OK button
                allowOutsideClick: false, // Prevent closing by clicking outside
                timerProgressBar: true, // Show a progress bar
              });
              this.closeModal();
              setTimeout(() => {
                window.location.reload();
              }, 1000); // Reload the page after 1 second
            }
            
          })
        } else {
          this.assignclicked = 0;
        }
      });
      this.getReadyQuestions();
    }
  }

  closeForm() {
    this.assignclicked = 0;
    this.selectedprogrammer = 1;
    this.getReadyQuestions();
  }

  closeModal() {
    if (this.closebuttton) {
      this.closebuttton.nativeElement.click(); // Safely access nativeElement
    } else {
    }
    this.assignclicked = 0;
    this.selectedprogrammer = 1;
    this.getReadyQuestions();
    this.diplayfile = 0;
  }

}
