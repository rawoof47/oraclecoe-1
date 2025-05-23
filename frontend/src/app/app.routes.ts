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

    // 🔒 Protected Routes
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
        path: 'job-details',
        component: JobDetailsComponent,
        canActivate: [authGuard, roleGuard('candidate')]
    },
    {
        path: 'post-a-job',
        component: PostAJobComponent,
        canActivate: [authGuard, roleGuard('recruiter')]
    },
    {
        path: 'single-resume',
        component: SingleResumeComponent,
        canActivate: [authGuard, roleGuard('recruiter')]
    },

    // Catch-all for unknown paths
    { path: '**', component: ErrorPageComponent }
];
