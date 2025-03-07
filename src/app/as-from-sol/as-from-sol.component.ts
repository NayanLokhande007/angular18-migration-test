import { Component, ElementRef, OnInit, Renderer2, ViewChild,AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useSearchFilter } from '../search-filter.signal';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-as-from-sol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './as-from-sol.component.html',
  styleUrl: './as-from-sol.component.css'
})
export class AsFromSolComponent implements OnInit {
  searchText: string = '';
  queForm!: FormGroup;
  emailid = localStorage.getItem('emailid');
  topics: any;
  subtopics: any;
  updatedData: any;
  selectedAnswerType: { id: string; name: string; } | undefined;
  queid: any;
  selectedQue: any;
  questionType: any;
  assignedData: any;
  currentDay: string | undefined;
  currentDate: string | undefined;
  currentMonth: any;
  currentYear: any;
  buttonclicked: number = 0;
  filePath: string="";
  diplayfile: any = 0;
  filename: any;

 

  constructor(private el: ElementRef, private renderer: Renderer2, private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) {

  }

  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button

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

  ngOnInit(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
    }
    this.intilizeQuestionFromGroup();
    this.getAllTopics();
    this.getSolutionsForApproval();
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
    this.currentMonth = month;
    this.currentYear = year;
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
      comment: [''],
      approveddate: [''],
      approvaliterations: [''],
      approvedmonth: [''],
      approvedyear: [''],
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

  getSolutionsForApproval() {
    this.globalservice.getSolutionsForApproval(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.updatedData = responsedata.data;
      this.selectedAnswerType = this.answerTypes.find(type => type.id === this.updatedData.answertype);
    })
  }

  getSolutionsForApprovalById(id: any) {
    this.queid = id;
    this.globalservice.getSolutionsForApprovalById(id).subscribe(result => {
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


  sendBackToSolutionProvider() {
    this.buttonclicked = 1;
    this.queForm.patchValue({
      id: this.queid,
    });
    Swal.fire({
      title: "Do you want to send back to solution provider?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Send",
      denyButtonText: `Don't send`
    }).then((result) => {
      if (result.isConfirmed) {
        this.globalservice.sendBackToSolutionProvider(this.queForm.value, this.queid).subscribe(result => {
          const responsedata = JSON.parse(JSON.stringify(result));
          if (responsedata.status == 200) {
            // Swal.fire("Sent back!", "", "success");
            Swal.fire({
              title: "Sent Back!",
              text: "Variation sent back to solution provider",
              icon: "success",
              timer: 2000, // Auto-close after 1 second
              showConfirmButton: false, // Hide the OK button
              allowOutsideClick: false, // Prevent closing by clicking outside
              timerProgressBar: true, // Show a progress bar
            });
            this.getSolutionsForApproval();
            this.closeModal();
          } else {
            Swal.fire("Technical issue !!!", "", "error");
          }
        })
      } else if (result.isDenied) {
        this.buttonclicked = 0;
        Swal.fire("Question submission cancelled", "", "info");
      }
    });
  }

  getAssignedQuestions() {
    this.globalservice.getSolutionDesignerAssignedQuestions(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.assignedData = responsedata.data;
    })
  }

  approvedByAssesor() {
    this.queForm.patchValue({
      id: this.queid,
      approveddate: this.currentDate
    });
    Swal.fire({
      title: "Do you want to approve?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Approve",
      denyButtonText: `Don't approve`
    }).then((result) => {
      if (result.isConfirmed) {

        this.queForm.patchValue({
          approvedmonth: this.currentMonth,
        });

        this.queForm.patchValue({
          approvedyear: this.currentYear,
        });

        this.globalservice.approvedByAssesor(this.queForm.value, this.queid).subscribe(result => {
          const responsedata = JSON.parse(JSON.stringify(result));
          if (responsedata.status == 200) {
            // Swal.fire("Approved!", "", "success");
            Swal.fire({
              title: "Approved!",
              text: "Variation approved successfully!!!",
              icon: "success",
              timer: 2000, // Auto-close after 1 second
              showConfirmButton: false, // Hide the OK button
              allowOutsideClick: false, // Prevent closing by clicking outside
              timerProgressBar: true, // Show a progress bar
            });
            this.getSolutionsForApproval();
            this.closeModal();
            setTimeout(() => {
              window.location.reload();
            }, 1000); // 1 second = 1000 milliseconds
          } else {
            Swal.fire("Technical issue !!!", "", "error");
          }
        })
      } else if (result.isDenied) {     
        Swal.fire("Question approval cancelled", "", "info");
        ;
      }
    });
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
  closeForm() {
    this.buttonclicked = 0;
  }

  closeModal() {
    console.log('close button clicked');
    if (this.closebuttton) {
      console.log('close button clicked in if');
      this.closebuttton.nativeElement.click(); // Safely access nativeElement
    } else {
      console.log('closebuttton is undefined'); 
    }
  }
  
  
}
