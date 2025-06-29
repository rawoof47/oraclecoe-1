import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject, of, forkJoin, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { JobPostService } from '../../services/job-post.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { MatTabsModule } from '@angular/material/tabs';
import { JobPost } from '../../auth/models/job-post.model';
import { PostAJobHelper } from './post-a-job-helper';
import { Region } from '../../auth/models/region.model';
import { RegionService } from '../../services/region.service';
import { Country } from '../../auth/models/country.model';
// Import Currency and CurrencyService
import { Currency } from '../../auth/models/currency.model';
import { CurrencyService } from '../../services/currency.service';

interface Skill {
  id: string;
  name: string;
}

interface Certification {
  id: string;
  certification_name: string;
}

interface JobPostResponse {
  message: string;
  data: JobPost;
}

interface JobPostListResponse {
  message: string;
  data: JobPost[];
}

@Component({
  selector: 'app-post-a-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgSelectModule,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
    MatTabsModule,
  ],
  templateUrl: './post-a-job.component.html',
  styleUrl: './post-a-job.component.scss',
})
export class PostAJobComponent implements OnInit {
  jobForm: FormGroup;
  loading = false;
  isEditMode = false;
  jobId: string | null = null;
  
  regions$!: Observable<Region[]>;
  countries$!: Observable<Country[]>;
  // Add currencies array
  currencies: Currency[] = [];
  selectedCurrencySymbol: string = '';
  selectedCurrencyCode: string = '';

  functionalSkills: Skill[] = [];
  technicalSkills: Skill[] = [];
  oracleMiddlewareSkills: Skill[] = [];
  reportingSkills: Skill[] = [];

  financialCertifications: Certification[] = [];
  scmCertifications: Certification[] = [];
  hcmCertifications: Certification[] = [];
  cxCertifications: Certification[] = [];

  workModeOptions = ['Remote', 'On-site', 'Hybrid'];

  private defaultHowToApplyText: string = 
    'How to Apply\n' +
    'Step 1: Find the Job Posting\n' +
    'Step 2: Read the Job Description Carefully\n' +
    'Step 3: Update Your Resume\n' +
    'Step 4: Click “Apply” and Fill in Details\n' +
    'Step 5: Submit Your Application';

  constructor(
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private helper: PostAJobHelper,
    // Inject CurrencyService
    private currencyService: CurrencyService
  ) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      experienceMin: [null, [Validators.required, Validators.min(0)]],
      experienceMax: [null, [Validators.required, Validators.min(0)]],
      employmentType: [[], Validators.required],
      // REMOVE compensationRange and add new fields
      // compensationRange: ['', Validators.required],
      currency: ['', Validators.required],
      compensation: [null, [Validators.required, Validators.min(0)]],
      salaryType: ['', Validators.required],
      workMode: ['', Validators.required],
      jobDescription: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      applicationDeadline: [''],
      recruiterId: ['', Validators.required],
      region_id: ['', Validators.required],
      country_id: ['', Validators.required],
      roleSummary: ['', Validators.required],
      preferredQualifications: [''],
      whatWeOffer: [''],
      howToApply: [this.defaultHowToApplyText, Validators.required],
      useStandardInstructions: [true],
      functionalSkills: [[]],
      technicalSkills: [[]],
      oracleMiddlewareSkills: [[]],
      reportingSkills: [[]],
      financialCertifications: [[]],
      scmCertifications: [[]],
      hcmCertifications: [[]],
      cxCertifications: [[]],
      location: [''],
    });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const recruiterId = user?.id;
    const role = user?.role;

    if (role === 'recruiter' && recruiterId) {
      this.jobForm.patchValue({ recruiterId });
    } else {
      console.warn('⚠️ No recruiter ID found. Ensure recruiter is logged in.');
    }

    this.regions$ = this.helper.getRegions();

    // Add currency initialization
    this.loadCurrencies();
    this.setupCurrencyListener();

    this.jobForm.get('region_id')?.valueChanges.subscribe(regionId => {
      if (regionId) {
        this.countries$ = this.helper.getCountriesByRegion(regionId);
      } else {
        this.countries$ = of([]);
        this.jobForm.get('country_id')?.reset();
      }
    });

    this.subscribeToUseStandardInstructions();

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.jobId = id;
        this.fetchJobDetails(id);
      } else {
        this.loadSkillsByCategory();
        this.loadCertificationsByCategory();
      }
    });
  }

  // Add new methods for currency handling
  private loadCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (data: Currency[]) => {
        this.currencies = data.map(currency => ({
          ...currency,
          codeNameSymbol: `${currency.code} - ${currency.name} (${currency.symbol})`
        }));
      },
      error: (err) => {
        console.error('Failed to load currencies', err);
      }
    });
  }

  private setupCurrencyListener(): void {
    this.jobForm.get('currency')?.valueChanges.subscribe(currencyId => {
      const currency = this.currencies.find(c => c.id === currencyId);
      this.selectedCurrencySymbol = currency?.symbol || '';
      this.selectedCurrencyCode = currency?.code || '';
    });
  }

  private subscribeToUseStandardInstructions(): void {
    this.jobForm.get('useStandardInstructions')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.jobForm.get('howToApply')?.setValue(this.defaultHowToApplyText, { emitEvent: false });
      }
    });
  }

  private fetchJobDetails(jobId: string): void {
    this.loading = true;
    forkJoin({
      job: this.jobPostService.getById(jobId).pipe(map(res => res.data)),
      functionalSkills: this.jobPostService.getFunctionalSkills('612222a1-791a-4125-be8d-1d86808a37bf'),
      technicalSkills: this.jobPostService.getFunctionalSkills('b9677d69-356f-11f0-bd34-80ce6232908a'),
      oracleMiddlewareSkills: this.jobPostService.getFunctionalSkills('0ec31fb0-3591-11f0-ae4b-80ce6232908a'),
      reportingSkills: this.jobPostService.getFunctionalSkills('843a8e1d-3591-11f0-ae4b-80ce6232908a'),
      financialCerts: this.jobPostService.getCertificationsByCategory('ed7c50c7-36d3-11f0-bfce-80ce6232908a'),
      scmCerts: this.jobPostService.getCertificationsByCategory('ed7c5da6-36d3-11f0-bfce-80ce6232908a'),
      hcmCerts: this.jobPostService.getCertificationsByCategory('ed7c5c88-36d3-11f0-bfce-80ce6232908a'),
      cxCerts: this.jobPostService.getCertificationsByCategory('ed7c5e82-36d3-11f0-bfce-80ce6232908a'),
    }).subscribe({
      next: (responses) => {
        const job = responses.job;
        this.functionalSkills = responses.functionalSkills;
        this.technicalSkills = responses.technicalSkills;
        this.oracleMiddlewareSkills = responses.oracleMiddlewareSkills;
        this.reportingSkills = responses.reportingSkills;
        this.financialCertifications = responses.financialCerts;
        this.scmCertifications = responses.scmCerts;
        this.hcmCertifications = responses.hcmCerts;
        this.cxCertifications = responses.cxCerts;
        
        this.populateForm(job, job.skill_ids || [], job.certification_ids || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch job details', err);
        this.loading = false;
        this.snackBar.open('Failed to load job details. Please try again.', 'Close', {
          duration: 4000,
          panelClass: 'snackbar-error'
        });
      }
    });
  }

  private populateForm(job: JobPost, skillIds: string[], certificationIds: string[]): void {
    const howToApplyValue = job.how_to_apply || this.defaultHowToApplyText;
    const useStandard = howToApplyValue === this.defaultHowToApplyText;

    // Update form with new currency fields
    this.jobForm.patchValue({
      jobTitle: job.job_title,
      experienceMin: job.experience_min,
      experienceMax: job.experience_max,
      employmentType: job.employment_type ? job.employment_type.split(',') : [],
      // Set new currency fields
      currency: job.currency_id,
      compensation: job.compensation_value,
      salaryType: job.salary_type,
      workMode: job.work_mode,
      jobDescription: job.job_description,
      noticePeriod: job.notice_period,
      applicationDeadline: job.application_deadline 
        ? new Date(job.application_deadline).toISOString().split('T')[0] 
        : null,
      region_id: job.region_id,
      country_id: job.country_id,
      roleSummary: job.role_summary,
      preferredQualifications: job.preferred_qualifications,
      whatWeOffer: job.what_we_offer,
      howToApply: howToApplyValue,
      useStandardInstructions: useStandard,
      location: job.location || ''
    }, { emitEvent: false });

    // Map skill IDs to skill objects
    this.jobForm.patchValue({
      functionalSkills: this.functionalSkills.filter(s => skillIds.includes(s.id)),
      technicalSkills: this.technicalSkills.filter(s => skillIds.includes(s.id)),
      oracleMiddlewareSkills: this.oracleMiddlewareSkills.filter(s => skillIds.includes(s.id)),
      reportingSkills: this.reportingSkills.filter(s => skillIds.includes(s.id)),
    });

    // Map certification IDs to certification objects
    this.jobForm.patchValue({
      financialCertifications: this.financialCertifications.filter(c => certificationIds.includes(c.id)),
      scmCertifications: this.scmCertifications.filter(c => certificationIds.includes(c.id)),
      hcmCertifications: this.hcmCertifications.filter(c => certificationIds.includes(c.id)),
      cxCertifications: this.cxCertifications.filter(c => certificationIds.includes(c.id)),
    });

    // Set countries$ based on region_id
    if (job.region_id) {
      this.countries$ = this.helper.getCountriesByRegion(job.region_id);
    } else {
      this.countries$ = of([]);
    }
  }

  loadSkillsByCategory(): void {
    this.loadSkillSet('612222a1-791a-4125-be8d-1d86808a37bf', 'functionalSkills');
    this.loadSkillSet('b9677d69-356f-11f0-bd34-80ce6232908a', 'technicalSkills');
    this.loadSkillSet('0ec31fb0-3591-11f0-ae4b-80ce6232908a', 'oracleMiddlewareSkills');
    this.loadSkillSet('843a8e1d-3591-11f0-ae4b-80ce6232908a', 'reportingSkills');
  }

  loadSkillSet(
    categoryId: string,
    property: 'functionalSkills' | 'technicalSkills' | 'oracleMiddlewareSkills' | 'reportingSkills'
  ): void {
    this.jobPostService.getFunctionalSkills(categoryId).subscribe({
      next: (data: Skill[]) => {
        this[property] = data || [];
      },
      error: (err) => {
        console.error(`Failed to load skills for ${property}:`, err);
      }
    });
  }

  loadCertificationsByCategory(): void {
    this.loadCertificationSet('ed7c50c7-36d3-11f0-bfce-80ce6232908a', 'financialCertifications');
    this.loadCertificationSet('ed7c5c88-36d3-11f0-bfce-80ce6232908a', 'hcmCertifications');
    this.loadCertificationSet('ed7c5da6-36d3-11f0-bfce-80ce6232908a', 'scmCertifications');
    this.loadCertificationSet('ed7c5e82-36d3-11f0-bfce-80ce6232908a', 'cxCertifications');
  }

  loadCertificationSet(
    categoryId: string,
    property: 'financialCertifications' | 'scmCertifications' | 'hcmCertifications' | 'cxCertifications'
  ): void {
    this.jobPostService.getCertificationsByCategory(categoryId).subscribe({
      next: (data: Certification[]) => {
        this[property] = data || [];
      },
      error: (err) => {
        console.error(`Failed to load certifications for ${property}:`, err);
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.snackBar.open('Please fill in the required fields.', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    this.loading = true;
    const formValues = this.jobForm.value;

    // Get selected currency
    const currency = this.currencies.find(c => c.id === formValues.currency);

    // Build job payload with new compensation structure
    const jobPostPayload = {
      ...formValues,
      employmentType: Array.isArray(formValues.employmentType)
        ? formValues.employmentType.join(',')
        : formValues.employmentType,
      experienceMin: Number(formValues.experienceMin),
      experienceMax: Number(formValues.experienceMax),
      applicationDeadline: formValues.applicationDeadline
        ? new Date(formValues.applicationDeadline).toISOString()
        : undefined,
      updatedBy: formValues.recruiterId,
      // Build compensation range string
      compensation_range: currency ? 
        `${currency.symbol} ${currency.code} ${formValues.compensation}` : 
        `${formValues.compensation}`,
      salaryType: formValues.salaryType
    };

    const selectedSkillIds: string[] = [
      ...formValues.functionalSkills.map((s: Skill) => s?.id).filter(Boolean),
      ...formValues.technicalSkills.map((s: Skill) => s?.id).filter(Boolean),
      ...formValues.oracleMiddlewareSkills.map((s: Skill) => s?.id).filter(Boolean),
      ...formValues.reportingSkills.map((s: Skill) => s?.id).filter(Boolean),
    ];

    const selectedCertificationIds: string[] = [
      ...formValues.financialCertifications.map((c: Certification) => c?.id).filter(Boolean),
      ...formValues.scmCertifications.map((c: Certification) => c?.id).filter(Boolean),
      ...formValues.hcmCertifications.map((c: Certification) => c?.id).filter(Boolean),
      ...formValues.cxCertifications.map((c: Certification) => c?.id).filter(Boolean),
    ];

    if (this.isEditMode && this.jobId) {
      this.updateJob(this.jobId, jobPostPayload, selectedSkillIds, selectedCertificationIds);
    } else {
      this.createJob(jobPostPayload, selectedSkillIds, selectedCertificationIds);
    }
  }

  private createJob(
    jobPostPayload: any,
    selectedSkillIds: string[],
    selectedCertificationIds: string[]
  ): void {
    const payloadWithLocation = {
      ...jobPostPayload,
      location: jobPostPayload.location || null
    };
    
    this.jobPostService.create(payloadWithLocation).subscribe({
      next: (response: JobPostResponse) => {
        const jobPostId = response.data?.id;
        if (!jobPostId) {
          throw new Error('Job post ID is missing in the response');
        }
        
        const jobNumber = response.data?.job_number;
        this.saveSkillsAndCerts(jobPostId, selectedSkillIds, selectedCertificationIds);
        
        if (jobNumber) {
          this.router.navigate(['/job-details', 'JID' + jobNumber]);
        } else {
          console.warn('Job number not found in response');
        }
      },
      error: (err) => {
        this.handleJobError(err);
      },
    });
  }

  private updateJob(
    jobId: string,
    jobPostPayload: any,
    selectedSkillIds: string[],
    selectedCertificationIds: string[]
  ): void {
    const payloadWithJobNumberAndLocation = {
      ...jobPostPayload,
      jobNumber: this.jobForm.getRawValue().jobNumber,
      location: jobPostPayload.location || null
    };

    this.jobPostService.update(jobId, payloadWithJobNumberAndLocation).subscribe({
      next: (response: JobPostResponse) => {
        const jobPostId = response.data?.id || jobId;
        this.saveSkillsAndCerts(jobPostId, selectedSkillIds, selectedCertificationIds);
      },
      error: (err) => {
        this.handleJobError(err);
      },
    });
  }

  private saveSkillsAndCerts(
    jobPostId: string,
    skillIds: string[],
    certificationIds: string[]
  ): void {
    const saveSkills$ = skillIds.length
      ? this.jobPostService.saveSkills(jobPostId, skillIds)
      : of(null);

    const saveCerts$ = certificationIds.length
      ? this.jobPostService.saveCertifications(jobPostId, certificationIds)
      : of(null);

    forkJoin([saveSkills$, saveCerts$]).subscribe({
      next: () => {
        this.showSuccessMessage();
      },
      error: (err) => {
        console.error('Error saving skills/certs:', err);
        this.snackBar.open(
          'Job saved, but failed to save skills/certifications',
          'Close',
          {
            duration: 4000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        this.loading = false;
      }
    });
  }

  private handleJobError(err: any): void {
    console.error('Job operation failed:', err);
    this.snackBar.open(err?.error?.message || 'Failed to process job. Please try again.', 'Close', {
      duration: 4000,
      panelClass: 'snackbar-error',
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    this.loading = false;
  }

  private showSuccessMessage(): void {
    const message = this.isEditMode 
      ? '✅ Job updated successfully!' 
      : '✅ Job created successfully!';

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-success',
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    
    if (!this.isEditMode) {
      this.jobForm.reset();
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.jobForm.patchValue({ recruiterId: user?.id });
    }
    
    this.loading = false;
  }
}