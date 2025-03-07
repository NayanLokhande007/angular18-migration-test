import { Component,ViewChild,ElementRef } from '@angular/core';
import { useSearchFilter } from '../search-filter.signal';
import { CommonModule } from '@angular/common';
import { GlobalServiceService } from '../global-service/global-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-approved-variations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './approved-variations.component.html',
  styleUrl: './approved-variations.component.css'
})
export class ApprovedVariationsComponent {

  approvedQue: any;
  selectedQue: any;
  availabledata: any;
  availableStatus: number = 1;
  sendbackmoderation: number=0;

  

  queForm!: FormGroup;
  emailid = localStorage.getItem('emailid');
  subtopics: any;
  topics: any;
  question: any;
  questionType: any;
  queid: any;
  questions: any;
  currentDay: string | undefined;
  currentDate: string | undefined;


  clicked: number = 0;
  selectedProgrammingRating: any;
  isYes: boolean = false;
  iterations: any;
  currentMonth: any;
  currentYear: any;

  filteredQue: any[] = [];  // Filtered data
  searchText: string = '';  // Search input text

  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button
  
    // This hook will execute once the view has been initialized
    ngAfterViewInit() {
      // Now the closebuttton is guaranteed to be initialized
      console.log('View initialized and closebuttton is available:', this.closebuttton);
    }

  constructor(private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.intilizeQuestionFromGroup();
    this.getAllTopics();
    this.updateDay();
    this.getModeratorAvailabiltyStatus();
    this.getApprovedVariationsOfProgrammer();
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
      approveddate: [this.currentDate],
      solutiondesigneremailid: [''],
      excellink: [''],
      querating: [''],
      approvaliterations: [''],
      programmerrating: [''],
      approvedmonth: [''],
      modeatedmonth: [''],
      approvedyear: [''],
      sendformoderation: [''],
      moderationcomments: [''],
      uploadeddateformoderation: [''],
    })
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

  getApprovedVariationsOfProgrammer() {
    this.globalservice.getApprovedVariationsOfProgrammer(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.approvedQue = responsedata.data;
        this.filteredQue = responsedata.data;
      }
    })
  }

  getApprovedQuestionById(id: any,sendbackformoderation:any) {
    this.sendbackmoderation=sendbackformoderation;
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


  getModeratorAvailabiltyStatus() {
    this.globalservice.getModeratorAvailabiltyStatus().subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.availabledata = responsedata.data;
        if (this.availabledata.length == 0) {
          this.availableStatus = 1;
        } else {
          this.availableStatus = 0;
        }
      }
    })
  }

  sendForModeration() {
    if (this.availableStatus == 1) {
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Moderator not available !',
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Upload this variation on VML portal before this process",
        icon: "warning",
       // Adjust the width as needed
        heightAuto: true, // Disable automatic height adjustment
        // Adjust padding to increase size if needed
        showCancelButton: true,
        confirmButtonColor: "#224561",
        cancelButtonColor: "#d33",
        confirmButtonText: "Send"
      }).then((result) => {
        if (result.isConfirmed) {
          this.queForm.patchValue({
            uploadeddateformoderation: this.currentDate,
          });
          this.globalservice.sendForModeration(this.queForm.value, this.queid).subscribe(result => {
            const responsedata = JSON.parse(JSON.stringify(result));
            if (responsedata.status == 200) {
              Swal.fire("Sent for moderation!", "", "success");
              this.getApprovedVariationsOfProgrammer();
              this.closeModal();
            } else {
              Swal.fire("Technical issue !!!", "", "error");
            }
          })

        } else if (result.isDenied) {
          Swal.fire("Sending cancelled", "", "info");
        }
      });
    }

  }


  sendBackForModeration() { 
    Swal.fire({
      title: "Are you sure?",
      text: "Sent back for moderation",
      icon: "warning",
     // Adjust the width as needed
      heightAuto: true, // Disable automatic height adjustment
      // Adjust padding to increase size if needed
      showCancelButton: true,
      confirmButtonColor: "#224561",
      cancelButtonColor: "#d33",
      confirmButtonText: "Send"
    }).then((result) => {
      if (result.isConfirmed) {
        this.queForm.patchValue({
          uploadeddateformoderation: this.currentDate,
        });
        this.globalservice.sendBackForModeration(this.queForm.value, this.queid).subscribe(result => {
          const responsedata = JSON.parse(JSON.stringify(result));
          if (responsedata.status == 200) {
            Swal.fire("Sent back for moderation!", "", "success");
            this.getApprovedVariationsOfProgrammer();
            this.closeModal();
          } else {
            Swal.fire("Technical issue !!!", "", "error");
          }
        })

      } else if (result.isDenied) {
        Swal.fire("Sending cancelled", "", "info");
      }
    });
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

  updateSearchText(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchText = input;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredQue = this.approvedQue.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

}
