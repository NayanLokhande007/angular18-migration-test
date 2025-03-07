import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-approval-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './approval-process.component.html',
  styleUrl: './approval-process.component.css'
})
export class ApprovalProcessComponent {
  que: any;
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

  moderationChangeToApprover: number = 0;

  filteredQue: any[] = [];  // Filtered data
  searchText: string = '';  // Search input text

  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button
  toggleclicked: number = 0;

  // This hook will execute once the view has been initialized
  ngAfterViewInit() {
    // Now the closebuttton is guaranteed to be initialized
    console.log('View initialized and closebuttton is available:', this.closebuttton);
  }


  constructor(private el: ElementRef, private renderer: Renderer2, private globalservice: GlobalServiceService, private router: Router, private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.intilizeQuestionFromGroup();
    this.getAllTopics();
    this.updateDay();
    this.getApprovalProcessQues();
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
      approvedate: [this.currentDate],
      solutiondesigneremailid: [''],
      excellink: [''],
      querating: [''],
      approvaliterations: [''],
      programmerrating: [''],
      approvedmonth: [''],
      moderatedmonth: [''],
      approvedyear: [''],
      moderationchangestoapprover: ['']
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

  getApprovalProcessQues() {
    this.globalservice.getApprovalProcessQues(this.emailid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.questions = responsedata.data;
        this.filteredQue = responsedata.data;
        this.globalservice.updateApprovalCount(this.questions.length);
      }
    })
  }


  getQuestionById(id: any, moderationchangestoapprover: any) {
    this.moderationChangeToApprover = moderationchangestoapprover;
    this.queid = id;
    this.globalservice.getReadyForCodingQuestionById(id).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      this.question = responsedata.data;
      this.queForm.patchValue(this.question); // Requires all form controls to be present in the data object
      this.questionType = this.question.quetype;
      this.queForm.patchValue({
        contributoremailid: this.question.contributoremailid,
      });

      this.queForm.patchValue({
        topicno: this.question.topicno,
      });

      this.queForm.patchValue({
        uploadeddatebycontributor: this.question.uploadeddatebycontributor,
      });

      this.getSubTopics(this.question.topicno);

      this.queForm.patchValue({
        subtopicno: this.question.subtopicno,
      });

      this.queForm.patchValue({
        approvaliterations: this.question.approvaliterations,
      });

      this.iterations = this.question.approvaliterations,
        this.setValue();
    })
    console.log(this.iterations, 'iteration 1');
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
    this.queForm.get('excellink')?.disable();
  }

  sendBackToProgrammer() {
    this.clicked = 1;
    if (this.toggleclicked == 1) {
      Swal.fire({
        title: "Do you want to send the question?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Send",
        denyButtonText: `Don't send`
      }).then((result) => {
        this.queForm.patchValue({
          moderationchangestoapprover: this.moderationChangeToApprover,
        });
        if (result.isConfirmed) {
          this.globalservice.sendBackToProgrammer(this.queForm.value, this.queid).subscribe(result => {
            const responsedata = JSON.parse(JSON.stringify(result));
            if (responsedata.status == 200) {
              Swal.fire({
                title: "Sent Back!",
                text: "Variation sent back to programmer",
                icon: "success",
                timer: 2000, // Auto-close after 1 second
                showConfirmButton: false, // Hide the OK button
                allowOutsideClick: false, // Prevent closing by clicking outside
                timerProgressBar: true, // Show a progress bar
              });
              // this.getApprovalProcessQues();
              this.closeModal();
              setTimeout(() => {
                window.location.reload();
              }, 1000); // 1 second = 1000 milliseconds
            } else {
              Swal.fire("Technical issue !!!", "", "error");
            }
          })
        } else if (result.isDenied) {
          this.clicked = 0;
        }
      });
    } else {
      Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Please check iteration count',
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
      });
      this.clicked = 0;
    }

  }

  checkIn() {
    Swal.fire({
      toast: true,
      icon: 'info',
      title: 'Please check in "Approval Process"',
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
    });
    this.globalservice.sendBackToProgrammer(this.queForm.value, this.queid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.questions = responsedata.data;
      }
    })
  }

  showPopup = false;
  stars = [1, 2, 3, 4, 5];
  selectedRating = 0;

  openPopup() {
    this.clicked = 1;
    this.showPopup = true;
  }

  submitQuestion() {
    this.queForm.patchValue({
      approvedate: this.currentDate,
    });

    this.queForm.patchValue({
      querating: this.selectedRating,
    });


    this.queForm.patchValue({
      programmerrating: this.selectedProgrammingRating,
    });

    this.queForm.patchValue({
      approvedmonth: this.currentMonth,
    });

    this.queForm.patchValue({
      approvedyear: this.currentYear,
    });


    this.globalservice.approveProgrammerAssignement(this.queForm.value, this.queid).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        Swal.fire({
          title: "Approved",
          text: "Variation approved",
          icon: "success",
          timer: 2000, // Auto-close after 1 second
          showConfirmButton: false, // Hide the OK button
          allowOutsideClick: false, // Prevent closing by clicking outside
          timerProgressBar: true, // Show a progress bar
        });
        this.closePopup();
        this.closeModal();
        this.selectedRating = 0;
        this.selectedProgrammingRating = 0;
        this.getApprovalProcessQues();
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1 second = 1000 milliseconds
      } else {
        Swal.fire("Technical issue !!!", "", "error");
      }
    })
  }
  closePopup() {
    this.clicked = 0;
    this.showPopup = false;
  }

  selectRating(rating: number) {
    this.selectedRating = rating;
  }

  submitRating() {
    if (this.selectedRating > 0) {
      alert(`You rated ${this.selectedRating} star(s). Thank you!`);
      this.closePopup();
    } else {
      alert('Please select a rating before submitting.');
    }
  }

  // Default value for the switch

  onToggle(event: Event) {
    this.toggleclicked = 1;
    const checkbox = event.target as HTMLInputElement;
    this.isYes = checkbox.checked;
    console.log('Switch is Yes:',);
    if (this.isYes) {
      this.iterations = this.iterations + 1,
        this.queForm.patchValue({
          approvaliterations: this.iterations
        });
    } else {
      this.iterations = this.iterations - 1;
      this.queForm.patchValue({
        approvaliterations: this.iterations
      });
    }
    console.log(this.iterations, 'iteration 2');
  }
  openLink() {
    console.log(this.question.excellink, 'link');
    window.open(this.question.excellink, '_blank');
  }
  copyLink() {
    const inputElement = this.queForm.get('excellink')?.value;
    if (inputElement) {
      inputElement.select(); // Select the text inside the textarea
      document.execCommand('copy'); // Copy the selected text to the clipboard
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Link Copied',
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
      });
    }

  }

  selectProgrammingRating(rating: number) {
    this.selectedProgrammingRating = rating;
  }

  closeModal() {
    this.selectedRating = 0;
    this.selectedProgrammingRating = 0;
    this.clicked = 0;
    this.showPopup = false;
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
    this.filteredQue = this.questions.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

}
