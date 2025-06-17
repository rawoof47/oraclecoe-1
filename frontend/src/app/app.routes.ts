import { Routes } from '@angular/router';
import { HomeDemoOneComponent } from './demos/home-demo-one/home-demo-one.component';
import { HomeDemoTwoComponent } from './demos/home-demo-two/home-demo-two.component';
import { HomeDemoThreeComponent } from './demos/home-demo-three/home-demo-three.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { FaqComponent } from './pages/faq/faq.component';
import { LoginComponent } from './auth/containers/login/login.component';
import { RegisterComponent } from './auth/containers/register/register.component';
import { EmployersComponent } from './pages/employers/employers.component';
import { EmployerDetailsComponent } from './pages/employer-details/employer-details.component';
import { DashboardComponent } from './dashboard/candidate-dashboard/dashboard.component';
import { SingleResumeComponent } from './pages/single-resume/single-resume.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { FavouriteJobsComponent } from './pages/favourite-jobs/favourite-jobs.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { PostAJobComponent } from './pages/post-a-job/post-a-job.component';
import { CandidatesComponent } from './pages/candidates/candidates.component';
import { CandidateDetailsComponent } from './pages/candidate-details/candidate-details.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { CandidateProfileComponent } from './pages/candidate-profile/candidate-profile.component';
import { AdminLoginComponent } from './auth/containers/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AppliedJobsComponent } from './pages/applied-jobs/applied-jobs.component';
import { JobApplicantsComponent } from './pages/job-applicants/job-applicants.component';
import { RecruiterDashboardComponent } from './dashboard/recruiter-dashboard/recruiter-dashboard.component';
import { PostedJobsComponent } from './pages/posted-jobs/posted-jobs.component'; // ✅ NEW
import { RecruiterProfileComponent } from './pages/recruiter-profile/recruiter-profile.component';
import { RecruiterSidebarComponent } from './common/recruiter-sidebar/recruiter-sidebar.component';

// Guards
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/index-2', pathMatch: 'full' },
  { path: 'index-1', component: HomeDemoOneComponent },
  { path: 'index-2', component: HomeDemoTwoComponent },
  { path: 'index-3', component: HomeDemoThreeComponent },

  { path: 'about', component: AboutUsComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'employers', component: EmployersComponent },
  { path: 'employer-details', component: EmployerDetailsComponent },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'candidate-details', component: CandidateDetailsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },

  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },

  // 🔒 Candidate Routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },
  {
    path: 'jobs',
    component: JobsComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },
  {
    path: 'favourite-jobs',
    component: FavouriteJobsComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },
  {
    path: 'job-details/:id',
    component: JobDetailsComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },
  {
    path: 'candidate-profile',
    component: CandidateProfileComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },
  {
    path: 'applied-jobs',
    component: AppliedJobsComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },
  {
    path: 'single-resume',
    component: SingleResumeComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },

  // 🔒 Recruiter Routes
  {
    path: 'post-a-job',
    component: PostAJobComponent,
    canActivate: [authGuard, roleGuard('recruiter')]
  },
  {
    path: 'single-resume',
    component: SingleResumeComponent,
    canActivate: [authGuard, roleGuard('candidate')]
  },
  {
    path: 'job-applicants/:jobId',
    component: JobApplicantsComponent,
    canActivate: [authGuard, roleGuard('recruiter')],
  },
  {
    path: 'job-applicants',
    component: JobApplicantsComponent,
    canActivate: [authGuard, roleGuard('recruiter')],
  },
  {
    path: 'recruiter-dashboard',
    component: RecruiterDashboardComponent,
    canActivate: [authGuard, roleGuard('recruiter')]
  },
  {
    path: 'recruiter/posted-jobs', // ✅ NEW ROUTE
    component: PostedJobsComponent,
    canActivate: [authGuard, roleGuard('recruiter')]
  },
  {
  path: 'recruiter-profile',
  component: RecruiterProfileComponent,
  canActivate: [authGuard, roleGuard('recruiter')]
},
{
  path: 'recruiter/sidebar',
  component: RecruiterSidebarComponent,
  canActivate: [authGuard, roleGuard('recruiter')]
},



  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },

  // Catch-all route
  { path: '**', component: ErrorPageComponent }
];
