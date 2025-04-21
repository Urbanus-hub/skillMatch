// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthSelectionComponent } from './auth/auth-selection/auth-selection.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
// Removed JobseekerComponent import as it seems unused for routing now
import { ProfileComponent } from './jobseeker/profile/profile.component'; // Keep if used elsewhere
import { SkillsComponent } from './jobseeker/skills/skills.component'; // Keep if used elsewhere
import { ResumeComponent } from './jobseeker/resume/resume.component'; // Keep if used elsewhere
import { WelcomeComponent } from './jobseeker/welcome/welcome.component'; // Keep if used elsewhere
import { SeekerDashboardComponent } from './jobseeker/seeker-dashboard/seeker-dashboard.component';
import { SkillmatchPortfolioComponent } from './jobseeker/seeker-dashboard/portfolio-skill-match/portfolio-skill-match.component';
import { SkillmatchSignupComponent } from './employerPart/employer-signup/employer-signup.component';
import { ContactFormComponent } from './employerPart/contactform/contactform.component';
import { CareerFieldsComponent } from './employerPart/career-fields/career-fields.component';
import { EnterpriseDetailsComponent} from './employerPart/enterprise-details/enterprise-details.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './admin/components/users/users.component';
import { JobsComponent as AdminJobsComponent } from './admin/components/jobs/jobs.component'; // Renamed to avoid conflict
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAnalyticsComponent } from './admin/components/admin-analytics/admin-analytics.component';
import { CompaniesComponent } from './admin/components/companies/companies.component';
import { TalentBoardComponent } from './employerPart/talent-board/talent-board.component';
import { ProfileSkillsComponent } from './jobseeker/seeker-dashboard/profile-skills/profile-skills.component';
// Import other child components for the dashboard if they exist
 import { JobsComponent } from './jobseeker/seeker-dashboard/jobs/jobs.component'; // Example
import {SkillPathComponent} from './jobseeker/seeker-dashboard/skill-path/skill-path.component';
import {MessagesComponent} from './jobseeker/seeker-dashboard/messages/messages.component';
import {InterviewsComponent} from './jobseeker/seeker-dashboard/interviews/interviews.component'
import { LearningComponent } from './jobseeker/seeker-dashboard/learning/learning.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth-selection', component: AuthSelectionComponent },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
      // Other auth routes
    ]
  },

  // --- Job Seeker Dashboard Routes ---
  {
    path:'seekerDashboard', // Main path for the dashboard layout
    component: SeekerDashboardComponent,
    children: [
        // Define child routes to be displayed in the router-outlet
        { path: 'profile', component: ProfileSkillsComponent }, // <-- ProfileSkills loads here
        { path: 'portfolio', component: SkillmatchPortfolioComponent },
        { path: 'jobs', component: JobsComponent }, // Example: Add Jobs component route
        { path: 'career', component: SkillPathComponent }, // Example
        { path: 'messages', component:MessagesComponent }, // Example
        { path: 'interviews', component: InterviewsComponent }, // Example
        { path: 'learning', component: LearningComponent }, // Example

        // Default child route for the dashboard
        { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  // --- End Job Seeker Dashboard Routes ---


  // --- Other Top-Level Routes (Review if needed) ---
  // These might be redundant if they are meant to be part of the dashboard
  {path: 'profile', component: ProfileComponent}, // Is this different from ProfileSkills?
  {path:'skills', component: SkillsComponent},
  {path: 'resume', component: ResumeComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path:'seekerPortfolio',component: SkillmatchPortfolioComponent}, // Already child route?
  {path:'profileSkills',component:ProfileSkillsComponent}, // REMOVE THIS - Now a child route

  // --- Employer Routes ---
  {path:'employerSignup',component: SkillmatchSignupComponent},
  {path:'contactForm',component: ContactFormComponent},
  {path:'careerFields',component: CareerFieldsComponent},
  {path:'enterpriseDetails',component: EnterpriseDetailsComponent},
  {path:'talentBoard',component:TalentBoardComponent},

  // --- Admin Routes ---
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'jobs', component: AdminJobsComponent }, // Use renamed import
      { path: 'analytics', component:AdminAnalyticsComponent},
      { path: 'companies' , component:CompaniesComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },

  // Wildcard route
  { path: '**', redirectTo: '' }
];
