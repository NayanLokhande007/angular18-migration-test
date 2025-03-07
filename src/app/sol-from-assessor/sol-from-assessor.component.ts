import { Component, ElementRef, OnInit, Optional, Renderer2 ,ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { useSearchFilter } from '../search-filter.signal';
import * as bootstrap from 'bootstrap';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-sol-from-assessor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sol-from-assessor.component.html',
  styleUrl: './sol-from-assessor.component.css'
})
export class SolFromAssessorComponent implements OnInit {
  searchText: string = '';

  emailid = localStorage.getItem('emailid');
  assignedData: any;
  queForm!: FormGroup;
  queid: any;
  selectedQue: any;
  //constructor() { }

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
  questionType: any;
  subtopics: any;
  topics: any;
  sendforapprovalclicked: number=0;


  
    @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button
  diplayfile: number=0;
  filePath: any;
  filename: string="";
  
    ngAfterViewInit() {
    }

  
  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
    }

    this.getAssignedQuestions();
    this.intilizeQuestionFromGroup();
    this.getAllTopics();
  }

  intilizeQuestionFromGroup() {
    this.queForm = this.fb.group({
      id:[''],
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
      uploadeddatebysolutiondesigner: [''],
      solutiondesigneremailid: [''],
      uploadeddatebyassesor: [''],
      approvaliterations:['']
    })
  }




  getAssignedQuestions() {
    this.globalservice.getSolutionDesignerAssignedQuestions(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.assignedData = responsedata.data;
    })
  }


  getAcceptedQuestionsById(id: any) {
    this.queid = id;
    this.globalservice.getAcceptedQuestionsById(id).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.selectedQue = responsedata.data;

      this.queForm.patchValue(this.selectedQue); // Requires all form controls to be present in the data object
      this.questionType = this.selectedQue.quetype;

      this.filename = this.selectedQue.filename;
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

      this.queForm.patchValue({
        id:this.queid,
      });

      this.queForm.get('topicno')?.disable(); // Disable the input field
      this.queForm.get('dod')?.disable();
      this.queForm.get('answertype')?.disable();
      this.queForm.get('quetype')?.disable();
      this.queForm.get('subtopicno')?.disable();
      this.queForm.get('varno')?.disable();
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

  getAllTopics() {
    this.globalservice.getAllTopics().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.topics = responsedata.data;
      }
    })
  }

  sendForApproval(){
    this.queForm.patchValue({
      id:this.queid,
    });
    
    this.sendforapprovalclicked=1;

    Swal.fire({
      title: "Do you want to send for approval?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Send",
      denyButtonText: `Don't send`
    }).then((result) => {   
      if (result.isConfirmed) {
        this.globalservice.sendForSolutionApproval(this.queForm.value).subscribe(result => {
          const responsedata = JSON.parse(JSON.stringify(result));
          if (responsedata.status == 200) {
            Swal.fire("Sent for approval!", "", "success");           
            this.getAssignedQuestions();
            this.closeModal();
          }else{
            Swal.fire("Technical issue !!!", "", "error");
          }
        })
      } else if (result.isDenied) {
        Swal.fire("Question submission cancelled", "", "info"); 
      }
    });
  
  }
  
  close(){
    
  }

  closeModal() {
    this.sendforapprovalclicked=0;
    if (this.closebuttton) {
      this.closebuttton.nativeElement.click(); // Safely access nativeElement
    } else {
    }
    
  }

  
  showfile() {
    this.diplayfile = 1;
    console.log(this.diplayfile);
  }

  closeFile() {
    this.diplayfile = 0;
  }
}