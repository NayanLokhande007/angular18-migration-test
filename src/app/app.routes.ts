import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { WorkStatusComponent } from './work-status/work-status.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { AssignedVariationsComponent } from './assigned-variations/assigned-variations.component';
import { UploadVariationComponent } from './upload-variation/upload-variation.component';
import { ApprovedVariationsComponent } from './approved-variations/approved-variations.component';
import { UploadModerationComponent } from './upload-moderation/upload-moderation.component';
import { ModeratedVariationsComponent } from './moderated-variations/moderated-variations.component';
import { UploadStatusComponent } from './upload-status/upload-status.component';
import { LoginRequestComponent } from './login-request/login-request.component';
import { authGuard } from './auth.guard'; // Adjust path as needed
import { ContributorComponent } from './contributor/contributor.component';
import { LatexEditorComponent } from './latex-editor/latex-editor.component';
import { ApprovedQuestionsComponent } from './approved-questions/approved-questions.component';
import { ApprovalProcessComponent } from './approval-process/approval-process.component';
import { ViewQuestionComponent } from './view-question/view-question.component';
import { IncomingQuestionsComponent } from './incoming-questions/incoming-questions.component';
import { AsQuestionsComponent } from './as-questions/as-questions.component';
import { AsFromSolComponent } from './as-from-sol/as-from-sol.component';
import { AsFromLatexComponent } from './as-from-latex/as-from-latex.component';
import { AsLatexCompletedComponent } from './as-latex-completed/as-latex-completed.component';
import { AsApprovedQuestionsComponent } from './as-approved-questions/as-approved-questions.component';
import { LoaderComponent } from './loader/loader.component';
import { SolApprovedComponent } from './sol-approved/sol-approved.component';
import { SolFromAssessorComponent } from './sol-from-assessor/sol-from-assessor.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AsDashboardComponent } from './as-dashboard/as-dashboard.component';
import { ApproverDashboardComponent } from './approver-dashboard/approver-dashboard.component';
import { ReadyQuestionsComponent } from './ready-questions/ready-questions.component';
import { LeaveApprovalComponent } from './leave-approval/leave-approval.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdContributorProfileComponent } from './ad-contributor-profile/ad-contributor-profile.component';
import { AdAssesorProfileComponent } from './ad-assesor-profile/ad-assesor-profile.component';
import { AdSolutionproviderProfileComponent } from './ad-solutionprovider-profile/ad-solutionprovider-profile.component';
import { AdApproverProfileComponent } from './ad-approver-profile/ad-approver-profile.component';
import { AdProgrammerProfileComponent } from './ad-programmer-profile/ad-programmer-profile.component';
import { AdModeratorProfileComponent } from './ad-moderator-profile/ad-moderator-profile.component';
import { EmpListComponent } from './emp-list/emp-list.component';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';
import { SolDashboardComponent } from './sol-dashboard/sol-dashboard.component';
import { ApAssignedQueComponent } from './ap-assigned-que/ap-assigned-que.component';
import { ModerationCompletedComponent } from './moderation-completed/moderation-completed.component';
import { NewModerationComponent } from './new-moderation/new-moderation.component';
import { ApApprovedVarComponent } from './ap-approved-var/ap-approved-var.component';
import { DriveLinkComponent } from './drive-link/drive-link.component';
import { ApModeratedVariationsComponent } from './ap-moderated-variations/ap-moderated-variations.component';
import { VerticalsDashboardComponent } from './verticals-dashboard/verticals-dashboard.component';
import { SolComponentComponent } from './sol-component/sol-component.component';

export const routes: Routes = [
    { path: '', redirectTo: '/welocme', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'testing', component: SolComponentComponent },
    { 
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'login-request', component: LoginRequestComponent },
            { path: 'employee-details', component: EmployeeDetailsComponent },
            { path: 'work-status', component: WorkStatusComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'assigned-var', component: AssignedVariationsComponent },
            { path: 'upload-var', component: UploadVariationComponent },
            { path: 'approved-var', component: ApprovedVariationsComponent },
            { path: 'upload-moderation', component: UploadModerationComponent },
            { path: 'moderated-var', component: ModeratedVariationsComponent },
            { path: 'upload-status', component: UploadStatusComponent },
            { path: 'contributor', component: ContributorComponent },
            { path: 'latex-editor', component: LatexEditorComponent },
            { path: 'approval-process', component: ApprovalProcessComponent },
            { path: 'approved-questions', component: ApprovedQuestionsComponent },
            { path: 'view-questions', component: ViewQuestionComponent },
            { path: 'contributor-questions', component: IncomingQuestionsComponent },
            { path: 'as-questions', component: AsQuestionsComponent },
            { path: 'as-from-sol', component: AsFromSolComponent },
            { path: 'as-from-latex', component: AsFromLatexComponent },
            { path: 'as-latex-completed', component: AsLatexCompletedComponent },
            { path: 'as-approved-que', component: AsApprovedQuestionsComponent },
            { path: 'loader', component: LoaderComponent },
            { path: 'sol-approved', component: SolApprovedComponent },
            { path: 'sol-from-assessor', component: SolFromAssessorComponent },
            { path: 'as-dashboard', component: AsDashboardComponent},
            { path: 'ap-dashboard', component: ApproverDashboardComponent},
            { path: 'ready-questions', component: ReadyQuestionsComponent},
            { path: 'leave-approval', component: LeaveApprovalComponent},
            { path: 'admin', component: AdminComponent},
            { path: 'admin-dashboard', component: AdminDashboardComponent},
            { path: 'contributor-profile', component: AdContributorProfileComponent},
            { path: 'assesor-profile', component: AdAssesorProfileComponent},
            { path: 'solutionprovider-profile', component: AdSolutionproviderProfileComponent},
            { path: 'approver-profile', component: AdApproverProfileComponent},
            { path: 'programmer-profile', component: AdProgrammerProfileComponent},
            { path: 'moderator-profile', component: AdModeratorProfileComponent},
            { path: 'emp-list', component: EmpListComponent},
            { path: 'moderator-dashboard', component: ModeratorDashboardComponent},
            { path: 'solution-provider-dashboard', component:SolDashboardComponent},
            { path: 'ap-assigned-que', component:ApAssignedQueComponent},
            { path: 'new-moderation', component:NewModerationComponent},
            { path: 'moderation-completed', component:ModerationCompletedComponent},
            { path: 'ap-approved-var', component:ApApprovedVarComponent},
            { path: 'drive-links', component:DriveLinkComponent},
            { path: 'ap-moderation-completed', component:ApModeratedVariationsComponent},
            {path:'vertical-dashboard',component:VerticalsDashboardComponent},
        ],
    },
    { path: '**', redirectTo: '/welcome' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
  })
export class AppRoutingModule {}
