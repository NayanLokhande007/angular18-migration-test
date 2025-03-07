import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useSearchFilter } from '../search-filter.signal';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-as-questions',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './as-questions.component.html',
  styleUrl: './as-questions.component.css'
})
export class AsQuestionsComponent implements OnInit{
  queForm!: FormGroup;
  acceptedData: any;
  selectedQue: any;
  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button
  filename: any;

  // This hook will execute once the view has been initialized
  ngAfterViewInit() {
    // Now the closebuttton is guaranteed to be initialized
    console.log('View initialized and closebuttton is available:', this.closebuttton);
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
  topics: any;
  subtopics: any;
  questionType: any;
  selectedAnswerType: any;
  filteredQue: any[] = [];  // Filtered data
  searchText: string = '';  // Search input text
  filePath: string = "";
  diplayfile: any = 0;

  constructor(private el: ElementRef, private renderer: Renderer2, private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) { }
  emailid = localStorage.getItem('emailid');
  queid:any;
  ngOnInit(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
    }
    this.intilizeQuestionFromGroup();
    this.getAcceptedQuestions();
    this.getAllTopics();
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
      assesoremailid: [this.emailid],
      filename: [''],
      filepath: [''],
      contributoremailid: [''],
      uploadeddatebycontributor: [''],
      oldquestionid: [''],
      comment:['']
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

  getAcceptedQuestions(){
    this.globalservice.getAcceptedQuestions(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.acceptedData = responsedata.data; 
      this.selectedAnswerType = this.answerTypes.find(type => type.id === this.acceptedData.answertype);
      this.filteredQue = responsedata.data;
    })
  }

  getAcceptedQuestionsById(id:any){
    this.queid=id;
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

  sendForSolutionDesigner(){
    Swal.fire({
      title: "Do you want to send the question?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Send",
      denyButtonText: `Don't send`
    }).then((result) => {   
      if (result.isConfirmed) {
        this.globalservice.sendForSolutionDesigner(this.queForm.value,this.queid).subscribe(result => {
          const responsedata = JSON.parse(JSON.stringify(result));
          if (responsedata.status == 200) {
            // Swal.fire("Sent to Solution Designer!", "", "success");
            Swal.fire({
              title: "Sent to Solution Designer!",
              text: "Variation sent to Solution designer",
              icon: "success",
              timer: 2000, // Auto-close after 1 second
              showConfirmButton: false, // Hide the OK button
              allowOutsideClick: false, // Prevent closing by clicking outside
              timerProgressBar: true, // Show a progress bar
            });
            this.getAcceptedQuestions();
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

  closeModal() {
    if (this.closebuttton) {     
      this.closebuttton.nativeElement.click(); // Safely access nativeElement
    } else { 
    }
  }

  updateSearchText(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchText = input;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredQue = this.acceptedData.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

  showfile() {
    this.diplayfile = 1;
    console.log(this.diplayfile);
  }

  closeFile() {
    this.diplayfile = 0;
  }


  onCloseModal() {
    this.filePath = "";
  }
  
}
