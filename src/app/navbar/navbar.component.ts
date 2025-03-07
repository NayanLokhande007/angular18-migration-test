import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { GlobalServiceService } from '../global-service/global-service.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  usertype: any | null = '';
  
  addstatus: number = 0;
  loginRequests: any;
  requestCount: number=0;
  approversData: any;
  readyQue: any;
  readyQueCount: number=0;
  emailid=localStorage.getItem('emailid')
  questions: any;
  approvalProcessQueCount: number=0;
  assignedQueData: any;
  assignedQueforProgrammer: number=0;
  approvalProcessOfProgrammerData: any;
  approvalProcessOfProgrammerCount: number=0;
  approvedQueofProgrammerData: any;
  readyForModerationCount: number=0;
  newModerationQueData: any;
  newModerationCount: number=0;
  newQueForAssesor: any;
  newQueForAssesorCount: number=0;
  readyForSolutionData: any;
  readyForSolutionLength: number=0;
  checkSolutionOfAssesorData: any;
  checkSolutionOfAssesorDataCount: number=0;
  assignedQueForSolutionProviderData: any;
  assignedQueForSolutionProviderDataCount: number=0;

  constructor(private fb: FormBuilder, private globalservice: GlobalServiceService, private router: Router) {
    this.getReadyQuestions();
    this.getApprovalProcessQues();
    this.getAssignedQuestions();
    this.getChangesOfQuestion();
    this.getAllContributorQue();
    this.getSolutionsForApproval();
    this.getAssignedQuestionsForSolutionProvider();
    this.getAcceptedQuestions();
   }
   
  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.getLoginRequets();
    this.updateDateTime();
    this.getReadyQuestions();
    this.getApprovalProcessQues();
    this.getAssignedQuestions();
    this.getChangesOfQuestion();
    this.getAllContributorQue();
    this.getSolutionsForApproval();
    this.getAssignedQuestionsForSolutionProvider();
    this.globalservice.approvalCount$.subscribe(count => {
      this.approvalProcessQueCount = count;
    });
    this.getAcceptedQuestions();
  }

  changeTableFontSize(fontSize: string) {
    document.documentElement.style.setProperty('--table-font-size', fontSize);
  }
  
  
  


  getLoginRequets(){
    this.globalservice.getLoginRequets().subscribe(result=>{
     const responsedata = JSON.parse(JSON.stringify(result));
     if (responsedata.status == 200) {
       this.loginRequests=responsedata.data;
       this.requestCount=this.loginRequests.length;
     }
    });
    
 }

 getReadyQuestions() {
  this.globalservice.getReadyQuestions().subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    this.readyQue = responsedata.data;
    this.readyQueCount=this.readyQue.length;
  })
}

getApprovalProcessQues() {
  this.globalservice.getApprovalProcessQues(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.questions = responsedata.data;
      this.approvalProcessQueCount= this.questions.length;
    }
  })
}

getAssignedQuestions() {
  this.globalservice.getAssignedQuestions(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    this.assignedQueData = responsedata.data;
    this.assignedQueforProgrammer=this.assignedQueData.length;
  })
}

getChangesOfQuestion(){
  this.globalservice.getChangesOfQuestion(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.approvalProcessOfProgrammerData = responsedata.data;
      this.approvalProcessOfProgrammerCount=this.approvalProcessOfProgrammerData.length;
    }
  })
}

getApprovedVariationsOfProgrammer() {
  this.globalservice.getApprovedVariationsOfProgrammer(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.approvedQueofProgrammerData= responsedata.data;
      this.readyForModerationCount= this.approvedQueofProgrammerData.length;
    }
  })
}

getNewModerationQue() {
  this.globalservice.getNewModerationQue(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    this.newModerationQueData = responsedata.data;
    this.newModerationCount=this.newModerationQueData.length;
  })
}

getAllContributorQue() {
  this.globalservice.getAllContributorQue(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    if (responsedata.status == 200) {
      this.newQueForAssesor = responsedata.data;
      this.newQueForAssesorCount=this.newQueForAssesor.length;
    }
  })
}

getAcceptedQuestions(){
  this.globalservice.getAcceptedQuestions(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    this.readyForSolutionData = responsedata.data; 
    this.readyForSolutionLength = this.readyForSolutionData.length; 
  })
}

getSolutionsForApproval() {
  this.globalservice.getSolutionsForApproval(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    this.checkSolutionOfAssesorData = responsedata.data;
    this.checkSolutionOfAssesorDataCount = this.checkSolutionOfAssesorData.length;
  })
}

getAssignedQuestionsForSolutionProvider() {
  this.globalservice.getSolutionDesignerAssignedQuestions(this.emailid).subscribe(result => {
    const responsedata = JSON.parse(JSON.stringify(result));
    this.assignedQueForSolutionProviderData = responsedata.data;
    this.assignedQueForSolutionProviderDataCount = this.assignedQueForSolutionProviderData.length;
  })
}


  gotoDashboard(){
    this.router.navigate(['/dashboard']);
  }
  gotoApproverDashboard(){
    this.router.navigate(['/ap-dashboard']);
  }
  gotoUploadVar(){
    this.router.navigate(['/upload-var']);
  }
  gotoAssignedVar(){
    this.router.navigate(['/assigned-var']);
  }

  gotoApprovedVar(){
    this.router.navigate(['/approved-var']);
  }

  gotoUploadModeration(){

    Swal.fire({
      title: "Are you sure?",
      text: "Redirecting on Virtual Math Lab Portal",
      icon: "warning",
     // Adjust the width as needed
      heightAuto: true, // Disable automatic height adjustment
      // Adjust padding to increase size if needed
      showCancelButton: true,
      confirmButtonColor: "#224561",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        let timerInterval: any;
    Swal.fire({
      title: 'Redirecting on Virtual Math Lab Portal',
      html: 'Redirecting in <b></b>',
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (b) {
            b.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {       
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        window.open('https://portal.coepvlab.ac.in/VirtualMathsLab/login', '_blank'); // Opens in a new tab
      }
    });
   
      }
    });
  }
  gotoEditVariations(){
    this.router.navigate(['/admin']);
  }
  gotoModeratedVar(){
    this.router.navigate(['/moderated-var']);
  }

  gotoUploadStatus(){
    this.router.navigate(['/upload-status']);
  }

  gotoLoginRequest(){
    this.router.navigate(['/login-request']);
  }
  gotoQueEntry(){
    this.router.navigate(['/contributor']);
  }
  gotoLatexEditor(){
    this.router.navigate(['/latex-editor']);
  }
  gotoApprovalProcess(){
    this.router.navigate(['/approval-process']);
  }
  gotoApprovedQue(){
    this.router.navigate(['/approved-questions']);
  }
  gotoViewQue(){
    this.router.navigate(['/view-questions']);
  }
  gotoIncomingQue(){
    this.router.navigate(['/contributor-questions']);
  }
  gotoQue(){
    this.router.navigate(['/as-questions']);
  }
  gotoSolDesigner(){
    this.router.navigate(['/as-from-sol'])
  }
  gotoLatexDesigner(){
    this.router.navigate(['/as-from-latex'])
  }
  gotoLatexComp(){
    this.router.navigate(['/as-latex-completed'])
  }
  gotoReadyQue(){
    this.router.navigate(['/ready-questions'])
  }
  gotoAsApprovedQue(){
    this.router.navigate(['/as-approved-que'])
  }
  gotoSolFromAssessor(){
    this.router.navigate(['./sol-from-assessor'])
  }
  gotoSolApproved(){
    this.router.navigate(['./sol-approved'])
  }
  gotoAsDashboard(){
    this.router.navigate(['./as-dashboard'])
  }
  gotoApproverApprovalProcess(){
    this.router.navigate(['./approval-process'])
  }

  gotoLeaveApproval(){
    this.router.navigate(['./leave-approval'])
  }

  gotoEmployeeDetails(){
    this.router.navigate(['./employee-details'])
  }
  gotoAdminDashboard(){
    this.router.navigate(['./admin-dashboard'])
  }
  gotoSolDashboard(){
    this.router.navigate(['./solution-provider-dashboard'])
  }
  gotoModeratorDashboard(){
    this.router.navigate(['./moderator-dashboard'])
  }
  gotoApAssignedQue(){
    this.router.navigate(['./ap-assigned-que'])
  }
  gotoNewModeration(){
    this.router.navigate(['./new-moderation'])
  }
  gotoModerationCompleted(){
    this.router.navigate(['./moderation-completed'])
  }
  gotoApproverApprovedVar(){
    this.router.navigate(['./ap-approved-var'])
  }
  gotoDriveLinks(){
    this.router.navigate(['./drive-links'])
  }

  gotoApproverModeratedVariations(){
    this.router.navigate(['./ap-moderation-completed'])
  }

  updateDateTime(): void {
    const currentDateElement = document.getElementById('current-date');
    const clockElement = document.getElementById('clock');

    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      if (currentDateElement) {
        currentDateElement.innerText = now.toLocaleDateString(undefined, options);
      }
      if (clockElement) {
        clockElement.innerText = now.toLocaleTimeString();
      }
    };

    updateTime();
    setInterval(updateTime, 1000); // Update the time every second
  }
}

