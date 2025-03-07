import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {


  private approvalCountSource = new BehaviorSubject<number>(0);
  approvalCount$ = this.approvalCountSource.asObservable();

  updateApprovalCount(count: number) {
    this.approvalCountSource.next(count);
  }
 

  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();

  private readonly Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });


  constructor(private http: HttpClient,) { }

  Register(data:any ,registerdate:any): Observable<any[]> { 
    const jsonData2= {
     emailid: data.email,
     firstname:data.firstName,
     lastname: data.lastName,
     gender:data.gender,
     mobileno:data.mobileno,
     password:data.password,
     usertype:data.userType,
     registerdate:registerdate,
     state:data.state,
     country:data.country,
     district:data.district,
     city:data.city,
     pincode:data.pincode,
    workinglanguage:data.workinglanguage

   };
   this.loadingSubject.next(true); // Show loader
   return this.http.post<any>(`${environment.url}user/adduser`,jsonData2,{headers:{'Content-Type':'application/json'}});
 }

 verifyEmail(emailid:any){
  let params = new HttpParams().set('emailid', emailid);
  return this.http.get<any>(`${environment.url}user/verifyEmail`,{ params });
 }

 getProfile(emailid:any){
  let params = new HttpParams().set('emailid', emailid);
  return this.http.get<any>(`${environment.url}user/getProfile`,{ params });
 }

 getLoginRequets(){
  return this.http.get<any>(`${environment.url}user/login-requests`);
 }

 acceptLoginRequest(emailid:string){
  let params = new HttpParams().set('emailid', emailid);
  this.loadingSubject.next(true);  
  return this.http.get<any>(`${environment.url}user/acceptLoginRequest`,{ params });
  
 }

 
sendEmail(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}user/sendRegisterEmail`,{ params });
}

declineRequest(emailid:any,firstname:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('firstname', firstname);
  this.loadingSubject.next(true);  
  return this.http.get<any>(`${environment.url}user/declineLoginRequest`,{ params });
}

// ------------------------------------------------------------------------------------------------------------------------



 submitQueEntry(formData: any) {
  this.loadingSubject.next(true); // Show loader
  return this.http.post<any>(`${environment.url}contributor/addQuestion`, formData);
}

getAllTopics(){
  return this.http.get<any>(`${environment.url}topic/getAllTopics`);
}

getSubTopics(topicno :any){
  let params = new HttpParams().set('topicno', topicno);
  return this.http.get<any>(`${environment.url}topic/getSubTopics`,{ params });
}

getAllContributorQue(emailid:any){
  const topicno=101;
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}contributor/getContributorQue`,{ params });
}

getQuestions(emailid:any){
  const topicno=101;
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}contributor/getQuestions`,{ params });
}

getContributorQue(id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.get<any>(`${environment.url}contributor/getContributorQueById`,{ params });
}

// ------------------------------------------------------------------------------------------------------------------------------------------------


getVariationNo(topicno:string,subtopicno:string){
  let params = new HttpParams()
  .set('topicno', topicno)
  .set('subtopicno', subtopicno);
  return this.http.get<any>(`${environment.url}question/getVariationNo`,{ params });
}

updateQuestion(formData: any){
  this.loadingSubject.next(true); // Show loader
  return this.http.post<any>(`${environment.url}question/updateQuestion`, formData,{headers:{'Content-Type':'application/json'}});
}


getSolutionProviderAvailabilty(){
  return this.http.get<any>(`${environment.url}question/getSolutionProviderAvailabilty`);
}

submitGroupQuestion(data:any){
  this.loadingSubject.next(true); // Show loader
  return this.http.post<any>(`${environment.url}contributor/addGroupQue`, data);
}

getSolutionDesignerAssignedQuestions(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}question/getSolutionDesignerQuestions`,{ params });
}

getAcceptedQuestions(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}question/getAcceptedQuestions`,{ params });
}

getAcceptedQuestionsById(id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.get<any>(`${environment.url}question/getAcceptedQuestionsById`,{ params });
}

sendForSolutionDesigner(data:any,id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.post<any>(`${environment.url}question/updateSolutionStatus`,data,{ params });
}
sendForSolutionApproval(data:any){
  this.loadingSubject.next(true); // Show loader
  return this.http.post<any>(`${environment.url}question/sendForSolutionApproval`, data);
}
getSolutionsForApproval(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}question/getSolutionsForApproval`,{ params });
}
getSolutionsForApprovalById(id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.get<any>(`${environment.url}question/getSolutionsForApprovalById`,{ params });
}

sendBackToSolutionProvider(data:any,id:any){
  let params = new HttpParams()
  .set('id', id)
  this.loadingSubject.next(true); // Show loader
  return this.http.post<any>(`${environment.url}question/sendBackToSolutionProvider`, data,{ params });
}

approvedByAssesor(data:any,id:any){
  let params = new HttpParams()
  .set('id', id)
  this.loadingSubject.next(true); // Show loader
  return this.http.post<any>(`${environment.url}question/approvedByAssesor`, data,{ params });
}

getApprovedByAssesorQuestions(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}question/getApprovedByAssesorQuestions`,{ params });
}

getReadyForCodingQuestionByIdInAssesor(id:any){
  let params = new HttpParams() 
  .set('id', id);
  return this.http.get<any>(`${environment.url}question/getReadyForCodingQuestionById`,{ params });
}

getApprovedByAssesorForSolutionProvider(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}question/getApprovedByAssesorForSolutionProvider`,{ params });
}

// -------------------------------------------------------------------------------------------------------------------
//ready Questions APis

getReadyQuestions(){
  return this.http.get<any>(`${environment.url}ready-questions/getReadyQuestions`);  
}

getReadyForCodingQuestionById(id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.get<any>(`${environment.url}ready-questions/getReadyForCodingQuestionById`,{ params });
}

getApprovedByAssesorById(id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.get<any>(`${environment.url}question/getReadyForCodingQuestionById`,{ params });
}


getQueBytopicAndSubtopic(topicno:any,subtopicno:any){
  let params = new HttpParams()
  .set('topicno', topicno)
  .set('subtopicno', subtopicno)
  return this.http.get<any>(`${environment.url}ready-questions/getProgrammers`,{ params });
}

getProgrammers(){
  return this.http.get<any>(`${environment.url}programmers/getProgrammers`);
}

 assignQuestionToProgrammer(queid:any,programmeremailid:any,date:any,emailid:any){
  let params = new HttpParams()
  .set('queid', queid)
  .set('programmeremailid', programmeremailid)
  .set('date',date)   
   .set('emailid',emailid)
  return this.http.get<any>(`${environment.url}ready-questions/assignQuestionToProgrammer`,{ params });
}
getAssignedQuestions(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}ready-questions/getAssignedQuestions`,{ params });
}

getTotalAssignedQuestionsByApprover(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}ready-questions/getTotalAssignedQuestionsToApprover`,{ params });
}

getApprovedAssignedQuestionsOfApprover(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}ready-questions/getApprovedAssignedQuestionsOfApprover`,{ params });
}

getPendingQuestionsOfApprover(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}ready-questions/getPendingQuestionsOfApprover`,{ params });
}

getModeratedQuestionsOfApprover(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}ready-questions/getModeratedQuestionsOfApprover`,{ params });
}

getMonthWiseApprovedVaritionsCountOfApprover(emailid:any,year:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('year',year)
  return this.http.get<any>(`${environment.url}ready-questions/getMonthWiseApprovedVaritionsCountOfApprover`,{ params });
}

getAssignedQuestionsNosendforapproval(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}ready-questions/getAssignedQuestionsNosendforapproval`,{ params });
}
// ------------------------------------------------------------------------------------------------------------------------------------------------

//Programmers APIs

getAssignedQuestionById(id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.get<any>(`${environment.url}programmers/getAssignedQuestionById`,{ params });
}

sendForApprovalByProgrammer(data:any,id:any){
  let params = new HttpParams()
  .set('id', id)
  this.loadingSubject.next(true); // Show loader
  return this.http.post<any>(`${environment.url}programmers/sendForApprovalByProgrammer`, data,{params});
}

getApprovalProcessQues(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}programmers/getApprovalProcessQues`,{params});
}

sendBackToProgrammer(data:any,id: any){
  let params = new HttpParams()
  .set('id', id)
  return this.http.post<any>(`${environment.url}programmers/sendBackToProgrammer`,data,{params});
}

getChangesOfQuestion(emailid: any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}programmers/getChangesOfQuestion`,{params});
}

sendBackForApproval(data:any,id:any){
  let params = new HttpParams()
  .set('id', id)
  return this.http.post<any>(`${environment.url}programmers/sendBackForApproval`,data,{params});
}

approveProgrammerAssignement(data:any,id:any){
  let params = new HttpParams()
  .set('id', id)
  return this.http.post<any>(`${environment.url}programmers/approveProgrammerAssignement`,data,{params});
}

updateQue(data:any,id:any){
  let params = new HttpParams()
  .set('id', id)
  return this.http.post<any>(`${environment.url}programmers/updateQue`,data,{params});
}

getAllVariationsOfProgrammer(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}programmers/getAllVariationsOfProgrammer`,{params});
}

getProgrammerWorkDetails(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}programmers/getProgrammerWorkDetails`,{params});
}
getMonthWiseApprovedVaritionsCount(emailid:any,year:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('year',year)
  return this.http.get<any>(`${environment.url}programmers/getMonthWiseApprovedVaritionsCount`,{params});
}

getApprovedVariationsOfProgrammer(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}programmers/getApprovedVariationsOfProgrammer`,{params});
}

sendForModeration(data:any,id:any){
  let params = new HttpParams()
  .set('id', id)
  return this.http.post<any>(`${environment.url}programmers/sendForModeration`,data,{params});
}

getModeratedQuestionsOfProgrammer(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}programmers/getModeratedQuestionsOfProgrammer`,{params});
}
//--------------------------------------------------Assesor--------------------------------------
getAssesorWorkDetails(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}user/getAssesorWorkDetails`,{params});
}
getMonthWiseApprovedVaritionsCountofAssesor(emailid:any,year:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('year',year)
  return this.http.get<any>(`${environment.url}user/getMonthWiseApprovedVaritionsCountofAssesor`,{params});
}

getMonthWiseAcceptedVaritionsCountofContributor(emailid:any,year:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('year',year)
  return this.http.get<any>(`${environment.url}user/getMonthWiseAcceptedVaritionsCountofContributor`,{params});
}

getMonthWiseApprovedVaritionsCountofSolutionProvider(emailid:any,year:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('year',year)
  return this.http.get<any>(`${environment.url}user/getMonthWiseApprovedVaritionsCountofSolutionProvider`,{params});
}

getMonthWiseApprovedVaritionsCountOfModerator(emailid:any,year:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('year',year)
  return this.http.get<any>(`${environment.url}user/getMonthWiseApprovedVaritionsCountOfModerator`,{params});
}

getSolutionProviderWorkDetails(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}user/getSolutionProviderWorkDetails`,{params});
}
// -------------------Admin-----------------------------------------------
getTotalQuestions(){
  return this.http.get<any>(`${environment.url}admin/getTotalQuestions`);
}

getTotalApprovedQuestions(){
  return this.http.get<any>(`${environment.url}admin/getTotalApprovedQuestions`);
}

getPendingQuestions(){
  return this.http.get<any>(`${environment.url}admin/getPendingQuestions`);
}

getModeratedQuestions(){
  return this.http.get<any>(`${environment.url}admin/getModeratedQuestions`);
}

getAllContributors(){
  return this.http.get<any>(`${environment.url}admin/getAllContributors`);
}

getAllAssesors(){
  return this.http.get<any>(`${environment.url}admin/getAllAssesors`);
}

getAllSolutionProviders(){
  return this.http.get<any>(`${environment.url}admin/getAllSolutionProviders`);
}

getAllApprovers(){
  return this.http.get<any>(`${environment.url}admin/getAllApprovers`);
}

getAllProgrammers(){
  return this.http.get<any>(`${environment.url}admin/getAllProgrammers`);
}

getAllModerators(){
  return this.http.get<any>(`${environment.url}admin/getAllModerators`);
}

getVerticalsInfo(){
  return this.http.get<any>(`${environment.url}verticals/getVerticalsInfo`);
}

getMonthWiseModeratedVaritionsCount(year:any){
  let params = new HttpParams()
  .set('year',year)
  return this.http.get<any>(`${environment.url}admin/getMonthWiseModeratedVaritionsCount`,{params});
}

getDriveLinksByTopic(topicno:any){
  let params = new HttpParams()
  .set('topicno',topicno)
  return this.http.get<any>(`${environment.url}ready-questions/getDriveLinksByTopic`,{params});
}

getOverallApprovalProcessQuestions(){
  return this.http.get<any>(`${environment.url}admin/getOverallApprovalProcessQuestions`);
}

getPendingForAssignQuestions(){
  return this.http.get<any>(`${environment.url}admin/getPendingForAssignQuestions`);
}

getPendingForProgrammingQuestions(){
  return this.http.get<any>(`${environment.url}admin/getPendingForProgrammingQuestions`);
}

getTodaysContrinbutedQuestions(date:any){
  let params = new HttpParams()
  .set('date',date)
  return this.http.get<any>(`${environment.url}admin/getTodaysContrinbutedQuestions`,{params});
}

getTodaysPendingForAssignQuestions(date:any){
  let params = new HttpParams()
  .set('date',date)
  return this.http.get<any>(`${environment.url}admin/getTodaysPendingForAssignQuestions`,{params});
}

getTodaysPendingForProgrammingQuestions(date:any){
  let params = new HttpParams()
  .set('date',date)
  return this.http.get<any>(`${environment.url}admin/getTodaysPendingForProgrammingQuestions`,{params});
}

getTodaysPendingModerationQuestions(date:any){
  let params = new HttpParams()
  .set('date',date)
  return this.http.get<any>(`${environment.url}admin/getTodaysPendingModerationQuestions`,{params});
}

getTodaysModeratedQuestions(date:any){
  let params = new HttpParams()
  .set('date',date)
  return this.http.get<any>(`${environment.url}admin/getTodaysModeratedQuestions`,{params});
}

getPendingQuestionsOfApproverForAdmin(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getPendingQuestionsOfApproverForAdmin`,{params});
}

getContributorDetails(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getContributorDetails`,{params});
}

getTotalContributedQuestions(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getTotalContributedQuestions`,{params});
}

getTotalAcceptedQuestions(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getTotalAcceptedQuestions`,{params});
}

getPendingQuestionsOfContributor(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getPendingQuestionsOfContributor`,{params});
}

getTotalQuestionsOfSolutionProvider(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getTotalQuestionsOfSolutionProvider`,{params});
}

getApprovedQuestionsOfSolutionProvider(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getApprovedQuestionsOfSolutionProvider`,{params});
}

getPendingQuestionsOfSolutionProvider(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getPendingQuestionsOfSolutionProvider`,{params});
}

getTotalQuestionsOfModerator(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getTotalQuestionsOfModerator`,{params});
}

getModeratedQuestionsOfModerator(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getModeratedQuestionsOfModerator`,{params});
}

getPendingQuestionsOfModerator(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}admin/getPendingQuestionsOfModerator`,{params});
}

getVerticalDetails(vertical:any){
  let params = new HttpParams()
  .set('vertical', vertical)
  return this.http.get<any>(`${environment.url}admin/getVerticalDetails`,{params});
}

getModeratedCountOfVertical(vertical:any){
  let params = new HttpParams()
  .set('vertical', vertical)
  
  return this.http.get<any>(`${environment.url}admin/getModeratedCountOfVertical`,{params});
}

getMonthWiseModeratedVaritionsCountOfVerticals(vertical:any,year:any){
  let params = new HttpParams()
  .set('year',year)
  .set('vertical',vertical)
  return this.http.get<any>(`${environment.url}admin/getMonthWiseModeratedVaritionsCountOfVerticals`,{params});
}


// ---------------------------------------Moderators------------------------------------------------

getNewModerationQue(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}moderator/getNewModerationQue`,{params});
}
moderateQuestion(data:any,queid:any){
  let params = new HttpParams()
  .set('id', queid)
  return this.http.post<any>(`${environment.url}moderator/moderateQuestion`,data,{params});
}
getModeratedQue(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}moderator/getModeratedQue`,{params});
}
getModeratedQueOfApprover(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}moderator/getModeratedQueOfApprover`,{params});
}
getModeratorAvailabiltyStatus(){
  return this.http.get<any>(`${environment.url}moderator/getModeratorAvailabiltyStatus`);
}

sendModerationChangeToProgrammer(data:any,queid:any){
  let params = new HttpParams()
  .set('id', queid)
  return this.http.post<any>(`${environment.url}moderator/sendModerationChangeToProgrammer`,data,{params});
}

sendModerationChangeToApprover(data:any,queid:any){
  let params = new HttpParams()
  .set('id', queid)
  return this.http.post<any>(`${environment.url}moderator/sendModerationChangeToApprover`,data,{params});
}

getQuestionForModerationById(id:any){
  let params = new HttpParams()
  .set('id', id);
  return this.http.get<any>(`${environment.url}ready-questions/getReadyForCodingQuestionById`,{ params });
}

sendBackForModeration(data:any,queid:any){
  let params = new HttpParams()
  .set('id', queid)
  return this.http.post<any>(`${environment.url}moderator/sendBackForModeration`,data,{params});
}

getModeratorWorkDetails(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  return this.http.get<any>(`${environment.url}moderator/getModeratorWorkDetails`,{params});
}

getMonthWiseModeratorsVaritionsCount(emailid:any,year:any){
  let params = new HttpParams()
  .set('emailid', emailid)
  .set('year',year)
  return this.http.get<any>(`${environment.url}moderator/getMonthWiseModeratorsVaritionsCount`,{params});
}

// ------------------------------------------------------Approver--------------------------------

getApprovedVariationsOfApprover(emailid:any){
  let params = new HttpParams()
  .set('emailid', emailid);
  return this.http.get<any>(`${environment.url}ready-questions/getApprovedVariationsOfApprover`,{ params });
}

getAllApprover(){
  return this.http.get<any>(`${environment.url}user/getAllApprover`);
}


}




