import { Component, ElementRef, OnInit, Renderer2 ,ViewChild} from '@angular/core';
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
  selector: 'app-incoming-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incoming-questions.component.html',
  styleUrl: './incoming-questions.component.css'
})
export class IncomingQuestionsComponent implements OnInit {
  searchText: string = '';
  topics: any[] = [];
  subtopics: any;
  queForm!: FormGroup;
  contributorQue: any;
  allContributorQue: any;
  ContributorQue: any;
  questionType: any;
  filePath: string = "../../assets/";
  diplayfile: any = 0;
  accept: boolean = false;
  oldquestionid: any;
  selectedTopicId: any;
  selectedSubTopicId: any;
  VariationData: any;
  filename: any;
  changeDetector: any;
  solutionprovideravailable: number = 2;
  submitclicked: number=0;

  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button

  ngAfterViewInit() {
  
  }


  constructor(private el: ElementRef, private renderer: Renderer2, private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.intilizeQuestionFromGroup();
    this.getAllTopics();
    this.getsolutionprovideravailabilty();
    this.getAllContributorQue();
  }

  emailid = localStorage.getItem('emailid');

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
    })
  }


  questionTypes: string[] = [
    'text',
    'audio',
    'video',
    'image'
  ];

  tableData = [
    {
      srNo: 1,
      question: 'The capital of France is Paris.',
      solution: 'What is the capital of France? It sounds like you re asking for icon suggestions for the following categories in Bootstrap 5. Here are appropriate Bootstrap Icons for each',
      contributorId: '002',
      date: "20-09-2024"
    },
    {
      srNo: 2,
      question: 'The largest planet is Jupiter.',
      solution: 'What is the largest planet in the solar system?',
      contributorId: '007',
      date: "16-09-2024"
    },
  ];

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

  searchSignal = useSearchFilter(this.tableData);

  updateSearchText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSignal.searchText.set(input.value);
  }

  getAllTopics() {
    this.globalservice.getAllTopics().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.topics = responsedata.data;
      }
    })
  }

  onTopicChange(event: any) {
    this.selectedTopicId = event.target.value;
    console.log(this.selectedTopicId);
    this.getSubTopics(this.selectedTopicId);
  }

  getSubTopics(topicno: any) {
    this.globalservice.getSubTopics(topicno).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.subtopics = responsedata.data;
      }
    })
  }

  getAllContributorQue() {
    this.globalservice.getAllContributorQue(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.allContributorQue = responsedata.data;
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
       // this.filePath = this.filePath + this.ContributorQue.filename;
        this.filename = this.ContributorQue.filename;
        this.filePath = `${environment.fileurl}${this.filename}`;

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
        this.selectedTopicId = this.ContributorQue.topicno;
        this.getSubTopics(this.ContributorQue.topicno);

        this.getsolutionprovideravailabilty();
      }
    })
  }

  showfile() {
    this.diplayfile = 1;
    console.log(this.diplayfile);
  }

  closeFile() {
    this.diplayfile = 0;
  }

  onCloseModal() {
    this.filePath = "../../assets/";
  }

  acceptQuestion() {
    this.accept = true;
  }

  onSubtopicChange(event: any) {
    this.selectedSubTopicId = event.target.value;
    console.log(this.selectedSubTopicId, 'subtopic id');
    this.queForm.patchValue({
      subtopicno: this.selectedSubTopicId,
    });
    this.getVariationNo();
  }
  getVariationNo() {
    this.globalservice.getVariationNo(this.selectedTopicId, this.selectedSubTopicId).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.VariationData = responsedata.data;
        if (this.VariationData == null) {
          this.queForm.patchValue({
            varno: 101,
          });
        } else {
          this.queForm.patchValue({
            varno: this.VariationData.varno + 1,
          });
        }


      }
    })
  }

  getsolutionprovideravailabilty(){
    this.globalservice.getSolutionProviderAvailabilty().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.data.length === 0) {
        console.log(this.solutionprovideravailable, 'available in if');
        this.solutionprovideravailable = 0;
        this.submitclicked=0;
        console.log(this.solutionprovideravailable, 'available in if 1');
      } else {
        this.solutionprovideravailable = 1;
      }
    });
  }

  updateQuestion() {
    this.submitclicked=1;
      if (this.solutionprovideravailable == 1) {
        // Patch form data
        this.queForm.patchValue({
          oldquestionid: this.oldquestionid,
        });
  
        if (this.queForm.valid) {
          Swal.fire({
            title: "Do you want to submit?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Submit",
            denyButtonText: `Don't submit`
          }).then((result) => {
            if (result.isConfirmed) {
              const contributorData = JSON.stringify(this.queForm.value);
              // Second API call to update the question
              this.globalservice.updateQuestion(contributorData).subscribe(result => {
                const responsedata = JSON.parse(JSON.stringify(result));
                if (responsedata.status === 200) {
                  // Swal.fire("Submitted!", "", "success");
                  Swal.fire({
                    title: "Submitted!",
                    text: "Question submitted",
                    icon: "success",
                    timer: 2000, // Auto-close after 1 second
                    showConfirmButton: false, // Hide the OK button
                    allowOutsideClick: false, // Prevent closing by clicking outside
                    timerProgressBar: true, // Show a progress bar
                  });
                  this.getAllContributorQue();
                  this.closeModal();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000); // 1 second = 1000 milliseconds
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: 'Technical issue, please contact the admin'
                  });
                }
              }, error => {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Failed to submit the question, please try again.",
                });
              });
  
            } else if (result.isDenied) {
              Swal.fire("Question not submitted", "", "info");
              this.submitclicked=0;
            }
          });
  
        } else {
          this.submitclicked=0;
          Swal.fire({
          toast: true,
          icon: 'warning',
          title: 'Please provide required fields! ',
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
        });
        }
      } else {
        Swal.fire({
          toast: true,
          icon: 'warning',
          title: 'Solution provider is not available!',
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
        });
      }
   
  }
  closeForm(){
    this.submitclicked=0;
    this.getAllTopics();
    this.getAllContributorQue();
  }

  closeModal() {
    if (this.closebuttton) {
      this.closebuttton.nativeElement.click(); // Safely access nativeElement
    } else {
    }
    this.submitclicked=0;
    this.getAllTopics();
    this.getAllContributorQue();
  }

}
