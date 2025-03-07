import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BackendserviceService } from '../services/backendservice.service';
import { LoaderComponent } from "../loader/loader.component";
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-contributor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './contributor.component.html',
  styleUrl: './contributor.component.css'
})
export class ContributorComponent implements OnInit {
  combinedArray: string[] = [];
  combinedArray2: string[] = [];
  QueEntryForm!: FormGroup;
  SubQueGroup!: FormGroup;
  QueGroup!: FormGroup;
  mathTopics: string[] = [
    'Basic operations on Integers and Fractions मूलभूत क्रिया -पूर्णांक आणि अपूर्णांक',
    'Numbers, Types of numbers संख्याज्ञान, संख्यांचे प्रकार',
    'Algebra बीजगणित',
    'Geometry भूमिती',
    'Co-ordinate Geometry निर्देशक भूमिती',
    'Trigonometry त्रिकोणमिती',
    'Commercial mathematics व्यावहारिक गणित',
    'Measurement and Mensuration मापन आणि महत्वमापन',
    'Data handling, Collection and Management माहिती आकलन, संकलन आणि व्यवस्थापन',
    'Probability संभाव्यता',
    'Patterns and Arithmetic Progression आकृतिबंध आणि अंकगणिती श्रेढी',
    'Sets संच'
  ];

  AnswerTypes: string[] = [
    'Singular Correct Answer',
    'Fill In The Blanks',
    'Match the Pairs',
    'True or False',
    'Multiple Correct Answers',
    'Image - Singular Correct Answer',
    'Image - Match the Pairs',
    'Image - Multiple Correct Answers'
  ];

  // Answer types (as before)
  questionTypes: string[] = [
    'text',
    'audio',
    'video',
    'image'
  ];
  showSelectFile: boolean | undefined;
  selectedQuestionType: any;
  selectedAnswerType: any;
  showCorrect: boolean = false;
  selectedFile: any;
  FileName: any;
  uploadForm: any;
  isImageTypeSelected: boolean | undefined;
  filepath: string | undefined;
  subtopics: any;
  topics: any[] = [];
  isGroupQueOpen = false;
  isSingularQueOpen = false;
  isTextFormOpen = false;
  isImgOpen = false;
  isVideoOpen = false;
  isStepperOpen = false;
  selectedImageFile: any;
  imageFileName: any;
  pdfFileName: any;
  selectedPdfFile: any;
  pdffilepath: string | undefined;
  imagefilepath: string | undefined;
  imageSize: any;
  currentDay: string | undefined;
  currentDate: string | undefined;
  loading: boolean = false; // Add loading state variable

  groupQue = new FormData();
  mainQuestion: any = {}; // To store the main question data
  subQuestions: any[] = []; // To store the subquestions
  pdfFileSize: any;
  truefalseSelected: number=0;

  @ViewChild('closebuttton') closebuttton: ElementRef | undefined; // Reference to the close button
    toggleclicked: number = 0;
  
    // This hook will execute once the view has been initialized
    ngAfterViewInit() {
      // Now the closebuttton is guaranteed to be initialized
      console.log('View initialized and closebuttton is available:', this.closebuttton);
    }
    
  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router, private backendservice: BackendserviceService,) {

  }

  emailid = localStorage.getItem('emailid');
  ngOnInit(): void {
    this.combineEnglishNumbersAndMarathiText();
    this.combineEnglishNumbersAndText();
    this.intilizeQuestionFromGroup();
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      this.QueEntryForm.patchValue(JSON.parse(savedFormData)); // Restore form data
    }
    this.getAllTopics();
    this.updateDay();

    this.globalservice.loading$.subscribe(isLoading => {
      this.loading = isLoading; // Update loading state
    });

    this.intilizeQueGroupForm();
    this.intilizeSubQueFormGroup();

  }


  ngOnDestroy() {
    // Save form data to localStorage before the component is destroyed
    localStorage.setItem('formData', JSON.stringify(this.QueEntryForm.value));
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

  intilizeQueGroupForm() {
    this.QueGroup = this.fb.group({
      topicno: ['', Validators.required],
      answertype: ['', Validators.required],
      quetype: ['', Validators.required],
      time: ['', Validators.required],
      dod: ['', Validators.required],
      question: ['', Validators.required],
      emailid: [this.emailid],
      queentrytype: ['group'],
      queuploadedtype: ['group'],
      uploadeddatebycontributor: [this.currentDate],
      filename: [''],
      filepath: [''],
      comment:['']
    })
  }

  intilizeSubQueFormGroup() {
    this.SubQueGroup = this.fb.group({
      question: ['',],
      solution: ['',],
      correctanswer1: ['',],
      correctanswer2: [''],
      correctanswer3: [''],
      wronganswer1: [''],
      wronganswer2: [''],
      wronganswer3: [''],
      wronganswer4: [''],
      wronganswer5: [''],
      wronganswer6: [''],
    })
  }



  intilizeQuestionFromGroup() {
    this.QueEntryForm = this.fb.group({
      topicno: ['', Validators.required],
      answertype: ['', Validators.required],
      quetype: ['', Validators.required],
      time: ['', Validators.required],
      dod: ['', Validators.required],
      question: ['',],
      solution: ['',],
      correctanswer1: ['',],
      correctanswer2: [''],
      correctanswer3: [''],
      wronganswer1: [''],
      wronganswer2: [''],
      wronganswer3: [''],
      wronganswer4: [''],
      wronganswer5: [''],
      wronganswer6: [''],
      emailid: [this.emailid],
      filename: [''],
      filepath: [''],
      queentrytype: [''],
      queuploadedtype: [''],
      quefilename: [''],
      quefilepath: [''],
      uploadeddatebycontributor: [],
      comment:['']
    })
  }

  combineEnglishNumbersAndMarathiText(): void {
    for (let i = 0; i < this.mathTopics.length; i++) {
      const number = (i + 1).toString().padStart(2, '0');
      this.combinedArray.push(`${number}. ${this.mathTopics[i]}`);
    }
  }

  combineEnglishNumbersAndText(): void {
    for (let i = 0; i < this.AnswerTypes.length; i++) {
      const number2 = (i + 1).toString().padStart(2, '0');
      this.combinedArray2.push(`${number2}. ${this.AnswerTypes[i]}`);
    }
  }

  onQuestionTypeChange(): void {

    this.isImageTypeSelected = this.QueEntryForm.get('quetype')?.value === 'image';

    this.selectedQuestionType = this.QueEntryForm.get('quetype')?.value;
    if (this.selectedQuestionType === 'image' || this.selectedQuestionType === 'video' || this.selectedQuestionType === 'audio') {
      this.showSelectFile = true;
    } else {
      this.showSelectFile = false;
    }
  }

  onQuestionTypeChange2(): void {

    this.isImageTypeSelected = this.QueEntryForm.get('quetype')?.value === 'image';

    this.selectedQuestionType = this.QueGroup.get('quetype')?.value;
    if (this.selectedQuestionType === 'image' || this.selectedQuestionType === 'video' || this.selectedQuestionType === 'audio') {
      this.showSelectFile = true;
    } else {
      this.showSelectFile = false;
    }
  }

  onAnswerTypeChange(): void {
   // this.showCorrect = this.QueEntryForm.get('answertype')?.value === '1' || this.QueEntryForm.get('answertype')?.value === '6';
    if( this.QueEntryForm.get('answertype')?.value === '4'){
      this.truefalseSelected=1;
      console.log('true false selected'+this.truefalseSelected);
    }else{
      this.truefalseSelected=0;
      console.log('true false not selected'+this.truefalseSelected);
    }

    if( this.QueEntryForm.get('answertype')?.value === '1' || this.QueEntryForm.get('answertype')?.value === '6' ){
      this.showCorrect=true;
      console.log('true false selected'+this.truefalseSelected);
    }else{
      this.showCorrect=false;
  
    }

  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.FileName = this.selectedFile.name;
    this.filepath = environment.fileurl + this.FileName + '';
    this.QueEntryForm.patchValue({
      filename: this.FileName,
      filepath: this.filepath
    });
  }

  onImageFileChange(event: any) {
    this.selectedImageFile = event.target.files[0];
    this.imageFileName = this.selectedImageFile.name;
    this.imageSize = this.selectedImageFile.size;
    this.imagefilepath = environment.fileurl + this.imageFileName + '';
    this.QueEntryForm.patchValue({
      quefilename: this.imageFileName,
      quefilepath: this.imagefilepath
    });
    this.QueGroup.patchValue({
      filename: this.imageFileName,
      filepath: this.imagefilepath
    });
  }


  onPdfFileChange(event: any) {

    this.selectedPdfFile = event.target.files[0];

    this.pdfFileName = this.selectedPdfFile.name;
    this.pdfFileSize = this.selectedPdfFile.size;

    this.pdffilepath = environment.fileurl + this.pdfFileName + '';

    this.QueEntryForm.patchValue({
      quefilename: this.pdfFileName,
      quefilepath: this.pdffilepath
    });
  }

  submitTextQueEntry() {

    this.QueEntryForm.patchValue({
      queentrytype: 'singular',
    });
   
    this.QueEntryForm.patchValue({
      queuploadedtype: 'text',
    });

    this.QueEntryForm.patchValue({
      uploadeddatebycontributor: this.currentDate,
    });

    this.QueEntryForm.patchValue({
      emailid: localStorage.getItem('emailid'),
    });

    const formData = new FormData();
    if (this.QueEntryForm.valid) {

      Swal.fire({
        title: "Do you want to submit?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Submit",
        denyButtonText: `Don't submit`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const contributorData = JSON.stringify(this.QueEntryForm.value);
          formData.append('contributor', contributorData);
          if (this.isImageTypeSelected && this.selectedFile) {
            formData.append('file', this.selectedFile);
          }
          this.globalservice.submitQueEntry(formData).subscribe(result => {
            const data = JSON.parse(JSON.stringify(result));
            if (data.status == 200) {
              this.QueEntryForm.reset();
              localStorage.removeItem('formData'); // Remove saved data on submit
              Swal.fire("Submitted!", "", "success");
            
              this.router.navigate(['/view-questions']);

            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: 'Technical issue please contact to admin'
              });
            }
          })

        } else if (result.isDenied) {
         // Swal.fire("Question not submitted", "", "info");
        }
      });


    } else {
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Please fill all required fields',
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
      });
    }

  }



  submitImageQueEntry() {

    this.QueEntryForm.patchValue({
      queentrytype: 'singular',
    });

    this.QueEntryForm.patchValue({
      queuploadedtype: 'image',
    });

    this.QueEntryForm.patchValue({
      question: 'Question provided in image format',
    });

    this.QueEntryForm.patchValue({
      quefilename: this.imageFileName,
      quefilepath: this.imagefilepath
    });

    this.QueEntryForm.patchValue({
      emailid: localStorage.getItem('emailid'),
    });

    this.QueEntryForm.patchValue({
      uploadeddatebycontributor: this.currentDate,
    });

    const formData = new FormData();
    if (this.QueEntryForm.valid) {

      Swal.fire({
        title: "Do you want to submit?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Submit",
        denyButtonText: `Don't submit`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (this.imageSize > 102400) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "File size is more than 100 KB",
            footer: ''
          });
        } else {
          if (result.isConfirmed) {
            const contributorData = JSON.stringify(this.QueEntryForm.value);
            formData.append('contributor', contributorData);
            if (this.isImageTypeSelected && this.selectedFile) {
              formData.append('file', this.selectedFile);
            }

            formData.append('quefile', this.selectedImageFile);

            this.globalservice.submitQueEntry(formData).subscribe(result => {
              const data = JSON.parse(JSON.stringify(result));
              if (data.status == 200) {
                this.QueEntryForm.reset();
                Swal.fire("Submitted!", "", "success");
                localStorage.removeItem('formData');
                this.router.navigate(['/view-questions']); // Remove saved data on submit
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                  footer: 'Technical issue please contact to admin'
                });
              }
            })


          } else if (result.isDenied) {
            //Swal.fire("Question not submitted", "", "info");
          }
        }
      });


    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please Fill All Details",
        showConfirmButton: false,
        timer: 3000
      });
    }

  }



  submitPDFQueEntry() {

    this.QueEntryForm.patchValue({
      queentrytype: 'singular',
    });

    this.QueEntryForm.patchValue({
      queuploadedtype: 'pdf',
    });

    this.QueEntryForm.patchValue({
      quefilename: this.pdfFileName,
      quefilepath: this.pdffilepath
    });

    this.QueEntryForm.patchValue({
      uploadeddatebycontributor: this.currentDate,
    });

    this.QueEntryForm.patchValue({
      question: 'Question provided in pdf format',
    });

    this.QueEntryForm.patchValue({
      emailid: localStorage.getItem('emailid'),
    });

    const formData = new FormData();
    if (this.QueEntryForm.valid) {

      Swal.fire({
        title: "Do you want to submit?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Submit",
        denyButtonText: `Don't submit`,
        didOpen: () => {
          const okButton = Swal.getConfirmButton();
          const denyButton =Swal.getDenyButton();
          const cancelButton = Swal.getCancelButton();
          if (okButton && denyButton) {
            okButton.id = 'confirmLogin-btn'; // Assign your desired ID
            denyButton.id = 'dontComfirm-btn';
            
          }
        },
      }).then((result) => {

        if (this.pdfFileSize > 2097152) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "File size is more than 2 MB",
            footer: ''
          });
        } else {
          if (result.isConfirmed) {
            const contributorData = JSON.stringify(this.QueEntryForm.value);
            formData.append('contributor', contributorData);
            if (this.isImageTypeSelected && this.selectedFile) {
              formData.append('file', this.selectedFile);
            }

            formData.append('quefile', this.selectedPdfFile);

            this.globalservice.submitQueEntry(formData).subscribe(result => {
              const data = JSON.parse(JSON.stringify(result));
              if (data.status == 200) {
                this.QueEntryForm.reset();
                Swal.fire("Submitted!", "", "success");
                localStorage.removeItem('formData');
                this.router.navigate(['/view-questions']); // Remove saved data on submit
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                  footer: 'Technical issue please contact to admin'
                });
              }
            })


          } else if (result.isDenied) {
           // Swal.fire("Question not submitted", "", "info");
          }
        }
        /* Read more about isConfirmed, isDenied below */
      });


    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please Fill All Details",
        showConfirmButton: false,
        timer: 3000,
        didOpen: () => {
          const okButton = Swal.getConfirmButton();
          if (okButton) {
            okButton.id = 'confirmLogin-btn'; // Assign your desired ID
          }
        },

      });
    }

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
    const selectedTopicId = event.target.value;
    this.getSubTopics(selectedTopicId);
  }

  getSubTopics(topicNo: any) {
    this.globalservice.getSubTopics(topicNo).subscribe(result => {
      const responsedata = JSON.parse(JSON.stringify(result));
      if (responsedata.status == 200) {
        this.subtopics = responsedata.data;
      }
    })
  }



  toggleStepperQue() {
 //remove comment to start the group Question   
      this.isStepperOpen = !this.isStepperOpen;

 // If Group Que is checked, uncheck Singular Que 
    if (this.isStepperOpen) {
      this.isTextFormOpen = false;
      this.isImgOpen = false;
      this.isVideoOpen = false;
      this.isSingularQueOpen = false;
    }
  }

  toggleSingularQue() {
    this.isSingularQueOpen = !this.isSingularQueOpen;

    // If Singular Que is checked, uncheck Group Que
    if (this.isSingularQueOpen) {
      this.isStepperOpen = false;
    }else{
      this.isStepperOpen = false;
      this.isTextFormOpen = false;
      this.isImgOpen = false;
      this.isVideoOpen = false;
    }
  }

  toggleTextForm() {
    this.isTextFormOpen = !this.isTextFormOpen;

    // If Singular Que is checked, uncheck Group Que
    if (this.isTextFormOpen) {
      this.isImgOpen = false;
      this.isVideoOpen = false;
    }
  }

  toggleImg() {

// to start this service revoe comment
     this.isImgOpen = !this.isImgOpen;

    // If Singular Que is checked, uncheck Group Que
    if (this.isImgOpen) {
      this.isTextFormOpen = false;
      this.isVideoOpen = false;
    }
  }

  toggleVideo() {
     this.isVideoOpen = !this.isVideoOpen;

    // If Singular Que is checked, uncheck Group Que
    if (this.isVideoOpen) {
      this.isTextFormOpen = false;
      this.isImgOpen = false;
    }
  }

  currentStepIndex = 0;
  steps = new Array(11).fill(0); // Creates an array with 10 steps
  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      // Save the current step data before moving to the next step
      if (this.currentStepIndex !== 0) {
        const subQuestionData = {
          question: this.SubQueGroup.value.question,
          solution: this.SubQueGroup.value.solution,
          correctanswer1: this.SubQueGroup.value.correctanswer1,
          correctanswer2: this.SubQueGroup.value.correctanswer2,
          correctanswer3: this.SubQueGroup.value.correctanswer3,
          wronganswer1: this.SubQueGroup.value.wronganswer1,
          wronganswer2: this.SubQueGroup.value.wronganswer2,
          wronganswer3: this.SubQueGroup.value.wronganswer3,
          wronganswer4: this.SubQueGroup.value.wronganswer4,
          wronganswer5: this.SubQueGroup.value.wronganswer5,
          wronganswer6: this.SubQueGroup.value.wronganswer6,
        };

        // Save this step's data in the subQuestions array
        this.subQuestions[this.currentStepIndex - 1] = subQuestionData;
      }

      // Move to the next step
      this.currentStepIndex++;

      // Load the next step's data if available
      if (this.currentStepIndex !== 0 && this.subQuestions[this.currentStepIndex - 1]) {
        this.SubQueGroup.patchValue(this.subQuestions[this.currentStepIndex - 1]);
      } else {
        // Reset the form if there's no saved data for the current step
        this.SubQueGroup.reset();
      }
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      // Save the current step's data before moving back
      if (this.currentStepIndex !== 0) {
        const subQuestionData = {
          question: this.SubQueGroup.value.question,
          solution: this.SubQueGroup.value.solution,
          correctanswer1: this.SubQueGroup.value.correctanswer1,
          correctanswer2: this.SubQueGroup.value.correctanswer2,
          correctanswer3: this.SubQueGroup.value.correctanswer3,
          wronganswer1: this.SubQueGroup.value.wronganswer1,
          wronganswer2: this.SubQueGroup.value.wronganswer2,
          wronganswer3: this.SubQueGroup.value.wronganswer3,
          wronganswer4: this.SubQueGroup.value.wronganswer4,
          wronganswer5: this.SubQueGroup.value.wronganswer5,
          wronganswer6: this.SubQueGroup.value.wronganswer6,
        };

        // Save this step's data in the subQuestions array
        this.subQuestions[this.currentStepIndex - 1] = subQuestionData;
      }

      // Move to the previous step
      this.currentStepIndex--;

      // Load the previous step's data if available
      if (this.subQuestions[this.currentStepIndex - 1]) {
        this.SubQueGroup.patchValue(this.subQuestions[this.currentStepIndex - 1]);
      } else {
        this.SubQueGroup.reset();
      }
    }
  }

  submitQueGroup() {
    const formData = new FormData();
    const mainQue = JSON.stringify(this.QueGroup.value);
    formData.append('mainQuestion', mainQue);
    const subQue = JSON.stringify(this.subQuestions);
    formData.append('subQuestions', subQue);
    if (this.selectedImageFile) {
      formData.append('file', this.selectedImageFile);
    }
  
    Swal.fire({
      title: "Do you want to submit the group question?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Submit",
      denyButtonText: `Don't submit`,
      didOpen: () => {
        const okButton = Swal.getConfirmButton();
        const denyButton =Swal.getDenyButton();
        if (okButton && denyButton) {
          okButton.id = 'confirmLogin-btn'; // Assign your desired ID
          denyButton.id = 'dontComfirm-btn';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;  // Show loader here
        this.globalservice.submitGroupQuestion(formData).pipe(
          finalize(() => {
            this.loading = false;  // Hide loader after the request completes
          })
        ).subscribe(
          (result) => {
            const responsedata = JSON.parse(JSON.stringify(result));
            if (responsedata.status == 200) {
              Swal.fire("Submitted!", "", "success");
  
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Technical issue",
                footer: ''
              });
            }
            this.QueGroup.reset();
            this.SubQueGroup.reset();
            this.subQuestions = [];
            this.currentStepIndex = 0;
          },
          (error) => {
            // Handle the error scenario
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              footer: ''
            });
          }
        );
      } else if (result.isDenied) {
       
      }
    });
  }
  
  excelData: any[][] = []; // Store Excel data
  displayedColumnIndexes: number[] = []; // Store valid column indexes
  showExcelData = false; // Toggle visibility

  // Specify which columns to skip (zero-based index)
  hiddenColumns = [6,7,8,10,11,13,14,15,17]; // Example: Hide 3rd and 5th columns

  onExcelFileChange(event: any): void {
    const target = event.target as HTMLInputElement;

    if (!target.files || target.files.length === 0) {
      console.error('No file selected.');
      return;
    }

    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetNames = workbook.SheetNames;
      if (sheetNames.length < 2) {
        console.error('Excel does not have a second sheet.');
        return;
      }

      const secondSheetName = sheetNames[1]; // Selecting the 2nd sheet
      const sheet = workbook.Sheets[secondSheetName];

      this.excelData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }); // Preserve structure
      this.setDisplayedColumns();
      console.log('Excel Data from 2nd Sheet:', this.excelData);
    };

    reader.readAsArrayBuffer(file);
  }

  setDisplayedColumns() {
    if (this.excelData.length > 0) {
      // Get indexes of all columns except hidden ones
      this.displayedColumnIndexes = this.excelData[0]
        .map((_, index) => index)
        .filter(index => !this.hiddenColumns.includes(index));
    }
  }

  toggleExcelView() {
    this.showExcelData = !this.showExcelData;
  }

  closeModal() {
    if (this.closebuttton) {
      this.closebuttton.nativeElement.click(); // Safely access nativeElement
    } else {
    }
  }
}
