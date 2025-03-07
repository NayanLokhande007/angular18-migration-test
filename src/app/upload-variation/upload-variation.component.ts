import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useSearchFilter } from '../search-filter.signal';
import * as bootstrap from 'bootstrap';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from "../loader/loader.component";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-upload-variation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-variation.component.html',
  styleUrl: './upload-variation.component.css'
})
export class UploadVariationComponent {
  loading: boolean = false;
  approvedQue: any;
  queForm!: FormGroup;
  emailid = localStorage.getItem('emailid');
  queid: any;
  selectedQue: any;
  questionType: any;
  topics: any;
  subtopics: any;
  changedQuestion: any;
  sendbackclicked: number = 0;

  filteredQue: any[] = [];  // Filtered data
  searchText: string = '';  // Search input text

  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button

  // This hook will execute once the view has been initialized
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
    this.getChangesOfQuestion();
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
      comment: [''],
      approveddate: [''],
      solutiondesigneremailid: [''],
      excellink: [''],
      approvaliterations: ['']
    })
  }

  getReadyForCodingQuestionById(id: any) {
    this.queid = id;
    this.globalservice.getReadyForCodingQuestionById(id).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.selectedQue = responsedata.data;

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
    this.queForm.get('contributoremailid')?.disable();
    this.queForm.get('uploadeddatebycontributor')?.disable();
    this.queForm.get('solutiondesigneremailid')?.disable();
    this.queForm.get('approveddate')?.disable();
  }

  getChangesOfQuestion() {
    this.globalservice.getChangesOfQuestion(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.changedQuestion = responsedata.data;
        this.filteredQue = responsedata.data;
      }
    })
  }

  sendBackForApproval() {
    this.sendbackclicked = 1;
    Swal.fire({
      title: "Do you want to send the question?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Send",
      denyButtonText: `Don't send`
    }).then((result) => {
      if (result.isConfirmed) {
        this.globalservice.sendBackForApproval(this.queForm.value, this.queid).subscribe(result => {
          const responsedata = JSON.parse(JSON.stringify(result));
          if (responsedata.status == 200) {
            this.changedQuestion = responsedata.data;
            Swal.fire({
              title: "Sent to Approver",
              text: "Variation sent back to Approver",
              icon: "success",
              timer: 2000, // Auto-close after 1 second
              showConfirmButton: false, // Hide the OK button
              allowOutsideClick: false, // Prevent closing by clicking outside
              timerProgressBar: true, // Show a progress bar
            });
            this.getChangesOfQuestion();
            this.closeModal();
          } else {
            Swal.fire("Technical issue !!!", "", "error");
          }
        })

      } else if (result.isDenied) {
        this.sendbackclicked = 0;
      }
    });
  }

  closepopup() {
    this.sendbackclicked = 0;
  }

  closeModal() {
    if (this.closebuttton) {
      this.closebuttton.nativeElement.click(); // Safely access nativeElement
    } else {
    }
    this.sendbackclicked = 0;
  }

  updateSearchText(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchText = input;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredQue = this.changedQuestion.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

}
