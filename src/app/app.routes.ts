// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthSelectionComponent } from './auth/auth-selection/auth-selection.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { JobseekerComponent } from './jobseeker/jobseeker/jobseeker.component';
import { ProfileComponent } from './jobseeker/profile/profile.component';
import { SkillsComponent } from './jobseeker/skills/skills.component';
import { ResumeComponent } from './jobseeker/resume/resume.component';
import { WelcomeComponent } from './jobseeker/welcome/welcome.component';
import { SeekerDashboardComponent } from './jobseeker/seeker-dashboard/seeker-dashboard.component';
import { SkillmatchPortfolioComponent } from './jobseeker/seeker-dashboard/portfolio-skill-match/portfolio-skill-match.component';
import { SkillmatchSignupComponent } from './employerPart/employer-signup/employer-signup.component';
import { ContactFormComponent } from './employerPart/contactform/contactform.component';
 import { CareerFieldsComponent } from './employerPart/career-fields/career-fields.component'; // Ensure the file exists or correct the path
import  {EnterpriseDetailsComponent} from './employerPart/enterprise-details/enterprise-details.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './admin/components/users/users.component';
import { JobsComponent } from './admin/components/jobs/jobs.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAnalyticsComponent } from './admin/components/admin-analytics/admin-analytics.component';
import { CompaniesComponent } from './admin/components/companies/companies.component';
import { TalentBoardComponent } from './employerPart/talent-board/talent-board.component';




export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth-selection', component: AuthSelectionComponent },
  { 
    path: 'auth', 
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
      // { path: 'jobseeker', component: JobseekerComponent },
      // Other auth routes
    ]
  },
  { 
    path: 'jobseeker', 
    component: JobseekerComponent,
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'skills', component: SkillsComponent },
      { path: 'resume', component: ResumeComponent },
      { path: 'dashboard', component: SeekerDashboardComponent },
      { path: 'portfolio', component: SkillmatchPortfolioComponent }
    ]
  },
  {path: 'profile', component: ProfileComponent},
  {path:'skills', component: SkillsComponent},
  {path: 'resume', component: ResumeComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path:'seekerDashboard',component: SeekerDashboardComponent},
  {path:'seekerPortfolio',component: SkillmatchPortfolioComponent},
  {path:'employerSignup',component: SkillmatchSignupComponent},
  {path:'contactForm',component: ContactFormComponent},
  {path:'careerFields',component: CareerFieldsComponent},
  {path:'enterpriseDetails',component: EnterpriseDetailsComponent},
  {path:'talentBoard',component:TalentBoardComponent},
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'jobs', component: JobsComponent },
      {path: 'analytics', component:AdminAnalyticsComponent},
      {path: 'companies' , component:CompaniesComponent},
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },                                                                                           
  

  
  
  
  
  
  
  
  
  
  
  { path: '**', redirectTo: '' }
];