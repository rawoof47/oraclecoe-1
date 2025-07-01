import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
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
import { Country } from '../../auth/models/country.model';
import { Currency } from '../../auth/models/currency.model';
import { CurrencyService } from '../../services/currency.service';
import { Degree } from '../../auth/models/degree.model';
import { DegreeService } from '../../services/degree.service';

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
  
  regions$!: Observable<Region[]>;
  countries$!: Observable<Country[]>;
  currencies: Currency[] = [];
  selectedCurrencySymbol: string = '';
  selectedCurrencyCode: string = '';
  degrees: Degree[] = [];

  functionalSkills: Skill[] = [];
  technicalSkills: Skill[] = [];
  oracleMiddlewareSkills: Skill[] = [];
  reportingSkills: Skill[] = [];

  financialCertifications: Certification[] = [];
  scmCertifications: Certification[] = [];
  hcmCertifications: Certification[] = [];
  cxCertifications: Certification[] = [];

  workModeOptions = ['Remote', 'On-site', 'Hybrid'];
  compensationTypes = ['Above', 'Below', 'Range', 'Exact'];

  private defaultHowToApplyText: string = 
    'How to Apply\n' +
    'Step 1: Find the Job Posting\n' +
    'Step 2: Read the Job Description Carefully\n' +
    'Step 3: Update Your Resume\n' +
    'Step 4: Click "Apply" and Fill in Details\n' +
    'Step 5: Submit Your Application';

  constructor(
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private helper: PostAJobHelper,
    private currencyService: CurrencyService,
    private degreeService: DegreeService
  ) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      experienceMin: [null, [Validators.required, Validators.min(0)]],
      experienceMax: [null, [Validators.required, Validators.min(0)]],
      employmentType: [[], Validators.required],
      currency: ['', Validators.required],
      compensationType: ['', Validators.required],
      compensationValue: [null, [Validators.min(0)]],
      compensationMin: [null, [Validators.min(0)]],
      compensationMax: [null, [Validators.min(0)]],
      salaryType: ['', Validators.required],
      workMode: ['', Validators.required],
      jobDescription: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      applicationDeadline: [''],
      recruiterId: ['', Validators.required],
      region_id: ['', Validators.required],
      country_id: ['', Validators.required],
      roleSummary: ['', Validators.required],
      whatWeOffer: [''], // Removed Validators.required since it's optional
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
      location: [''], // Removed Validators.required since it's optional
    }, { validators: this.compensationValidator });
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

    // Load degrees
    this.degreeService.getDegrees().subscribe({
      next: (res) => {
        this.degrees = res;
      },
      error: (err) => console.error('Failed to load degrees', err),
    });

    this.regions$ = this.helper.getRegions();
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
    
    // Always load skills and certifications for new job posting
    this.loadSkillsByCategory();
    this.loadCertificationsByCategory();

    // Set validators based on compensation type
    this.jobForm.get('compensationType')?.valueChanges.subscribe(type => {
      const valueControl = this.jobForm.get('compensationValue');
      const minControl = this.jobForm.get('compensationMin');
      const maxControl = this.jobForm.get('compensationMax');

      // Clear previous validators
      valueControl?.clearValidators();
      minControl?.clearValidators();
      maxControl?.clearValidators();

      // Set validators based on type
      switch(type) {
        case 'Above':
          valueControl?.setValidators([Validators.required, Validators.min(0)]);
          break;
        case 'Below':
          valueControl?.setValidators([Validators.required, Validators.min(0)]);
          break;
        case 'Range':
          minControl?.setValidators([Validators.required, Validators.min(0)]);
          maxControl?.setValidators([Validators.required, Validators.min(0)]);
          break;
        case 'Exact':
          valueControl?.setValidators([Validators.required, Validators.min(0)]);
          break;
      }

      valueControl?.updateValueAndValidity();
      minControl?.updateValueAndValidity();
      maxControl?.updateValueAndValidity();
    });
  }

  // Custom validator for compensation
  private compensationValidator(group: AbstractControl): ValidationErrors | null {
    const compType = group.get('compensationType')?.value;
    const compValue = group.get('compensationValue')?.value;
    const compMin = group.get('compensationMin')?.value;
    const compMax = group.get('compensationMax')?.value;

    if (compType === 'Range' && compMin !== null && compMax !== null && compMin > compMax) {
      return { minGreaterThanMax: true };
    }
    return null;
  }

  private formatNumberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

    // Validate compensation range
    const compType = this.jobForm.get('compensationType')?.value;
    const compMin = this.jobForm.get('compensationMin')?.value;
    const compMax = this.jobForm.get('compensationMax')?.value;
    
    if (compType === 'Range' && compMin > compMax) {
      this.snackBar.open('Maximum compensation must be greater than minimum compensation.', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    this.loading = true;
    const formValues = this.jobForm.value;

    // Build compensation range string based on type
    let compensationRange = '';
    switch(formValues.compensationType) {
      case 'Above':
        compensationRange = `${this.selectedCurrencySymbol} ${this.selectedCurrencyCode} ${this.formatNumberWithCommas(formValues.compensationValue)} above`;
        break;
      case 'Below':
        compensationRange = `${this.selectedCurrencySymbol} ${this.selectedCurrencyCode} below ${this.formatNumberWithCommas(formValues.compensationValue)}`;
        break;
      case 'Range':
        compensationRange = `${this.selectedCurrencySymbol} ${this.selectedCurrencyCode} ${this.formatNumberWithCommas(formValues.compensationMin)} - ${this.formatNumberWithCommas(formValues.compensationMax)}`;
        break;
      case 'Exact':
        compensationRange = `${this.selectedCurrencySymbol} ${this.selectedCurrencyCode} ${this.formatNumberWithCommas(formValues.compensationValue)}`;
        break;
    }

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
      compensation_range: compensationRange,
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

    this.createJob(jobPostPayload, selectedSkillIds, selectedCertificationIds);
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
    this.snackBar.open('✅ Job created successfully!', 'Close', {
      duration: 3000,
      panelClass: 'snackbar-success',
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    
    // Reset form after successful creation
    this.jobForm.reset();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.jobForm.patchValue({ recruiterId: user?.id });
    this.jobForm.patchValue({ howToApply: this.defaultHowToApplyText });
    this.jobForm.patchValue({ useStandardInstructions: true });
    
    this.loading = false;
  }
}