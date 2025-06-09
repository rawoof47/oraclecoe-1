import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
//import { Training } from '../shared/models/training.model';
import { Course } from '../shared/models/training.model';


@Injectable({
  providedIn: 'root',
})
export class TrainingsService {
  private trainings: Course[] = [
    {
      id: '1',
      name: 'Fusion Financials',
      content: 'GL, AP, AR, FA, CM, Tax, Expenses, Supplier model, Reporting (BIP, OTBI), Test Scripts, Mock & Shadow Projects',
      duration: '6 Months',
      eligibility: 'Graduates / Post Graduates / Freshers',
      weekPlan: '12 Weeks Training + 6 Weeks Mock Project + 6 Weeks Shadow Project = 24 Weeks',
      modes: {
        online: {
          //fee: '60000',
          batchSize: 30,
          //permonth: '10000',
          highlights: ['Live sessions', 'Access to LMS', 'Weekend support'],
          duration: '',
          content: '',
          fee: ''
        },
        office: {
          //fee: '120000',
          //permonth: '20000',
          batchSize: 25,
          highlights: ['In-person sessions', 'Group tasks', 'Mentorship access'],
          duration: '',
          content: '',
          fee: ''
        },
        hybrid: {
          //fee: '90000',
          //permonth: ' 15000',
          batchSize: 30,
          highlights: ['Live + In-person mix', 'Flexible scheduling'],
          duration: '',
          content: '',
          fee: ''
        },
      },
    },
    {
      id: '2',
      name: 'Fusion PPM',
      content: 'Project Costing, Control — add-on to Fusion Financials',
      duration: '2 Months',
      eligibility: 'Graduates / Post Graduates / Freshers',
      weekPlan: '4 Weeks Training + 2 Weeks Mock Project = 6 Weeks',
      modes: {
        online: {
          // fee: '40000',
          // permonth: '20000',
          batchSize: 30,
          highlights: ['Focused learning', 'Mock cycles'],
          duration: '',
          content: '',
          fee: ''
        },
        office: {
          //fee: '60000',
          //permonth: '30000',
          batchSize: 30,
          highlights: ['In-person mentoring', 'Small batches'],
          duration: '',
          content: '',
          fee: ''
        },
        hybrid:
         {
           //fee: '50000',
           //permonth: '25000',
           batchSize: 30,
           highlights: ['Live + in-person', 'Recorded sessions'],
           duration: '',
           content: '',
           fee: ''
         },
      },
    },
    {
      id: '3',
      name: 'Fusion SCM (Supply Chain Management)',
      content: 'Project Financials + Billing, Revenue, Grants — advanced add-on',
      duration: '2.5 Months',
      eligibility: 'Graduates/post Graduates/Freshers',
      weekPlan: '6 Weeks Training + 2 Weeks Mock = 8 Weeks',
      modes: {
        online: {
          //fee: '60000',
          //permonth: '24000',
          batchSize: 30,
          highlights: ['Live training', 'Labs access'],
          duration: '',
          content: '',
          fee: ''
        },
        office: {
          //fee: '80000',
          //permonth: '32000',
          batchSize: 30,
          highlights: ['Group activities', 'Trainer-led discussions'],
          duration: '',
          content: '',
          fee: ''
        },
        hybrid: {
          //fee: '70000',
          //permonth: '28000',
          batchSize: 30,
          highlights: ['Blended delivery', '1-on-1 Q&A'],
          duration: '',
          content: '',
          fee: ''
        },
      },
    },
    {
      id: '4',
      name: 'Fusion HCM (Human Capital Management)',
      content: 'Includes all Project modules + Execution & Resource Management',
      duration: '3 Months',
      eligibility: 'Graduates/post graduates/Freshers',
      weekPlan: '8 Weeks Training + 2 Weeks Mock = 10 Weeks',
      modes: 
      {
        online: 
        {
          // fee: ' 90000',
          // permonth: '36000',
          batchSize: 30,
          highlights: ['Deep dive content', 'Remote support'],
          duration: '',
          content: '',
          fee: ''
        },
        office: {
          // fee: '120000',
          batchSize: 30,
          // permonth: '48000',
          highlights: ['Office coaching', 'Live mentoring'],
          duration: '',
          content: '',
          fee: ''
        },
        hybrid: {
          //fee: ' 100000',
          //permonth: '40000',
          batchSize: 30,
          highlights: ['Hybrid format', 'Extra project help'],
          duration: '',
          content: '',
          fee: ''
        },
      },
    },
    {
      id: '5',
      name: 'Full Stack Development',
      content: 'MEAN + MERN Stack DEvelopment',
      duration: '3 Months',
      eligibility: 'Graduates / Post Graduates / Freshers',
      weekPlan: '8 Weeks Training + 2 Weeks Mock = 10 Weeks',
      modes: 
      {
        online: 
        {
          // fee: ' 90000',
          // permonth: '36000',
          batchSize: 30,
          highlights: ['Deep dive content', 'Remote support'],
          duration: '',
          content: '',
          fee: ''
        },
        office: {
          // fee: '120000',
          batchSize: 30,
          // permonth: '48000',
          highlights: ['Office coaching', 'Live mentoring'],
          duration: '',
          content: '',
          fee: ''
        },
        hybrid: {
          //fee: ' 100000',
          // permonth: '40000',
          batchSize: 30,
          highlights: ['Hybrid format', 'Extra project help'],
          duration: '',
          content: '',
          fee: ''
        },
      },
    },
    {
      id: '6',
      name: 'OIC &  BI Publisher',
      content: 'Build integrations and custom reports using OIC & BIP tools.',
      duration: '3 Months',
      eligibility: 'Graduates/Post Graduates/Freshers',
      weekPlan: '8 Weeks Training + 2 Weeks Mock = 10 Weeks',
      modes: 
      {
        online: 
        {
          // fee: ' 90000',
          // permonth: '36000',
          batchSize: 30,
          highlights: ['Deep dive content', 'Remote support'],
          duration: '',
          content: '',
          fee: ''
        },
        office: {
          // fee: '120000',
          batchSize: 30,
          //permonth: '48000',
          highlights: ['Office coaching', 'Live mentoring'],
          duration: '',
          content: '',
          fee: ''
        },
        hybrid: {
          // fee: ' 100000',
          // permonth: '40000',
          batchSize: 30,
          highlights: ['Hybrid format', 'Extra project help'],
          duration: '',
          content: '',
          fee: ''
        },
      },
    },
  ];

  getAllTrainings(): Observable<Course[]> {
    return of(this.trainings);
  }

  getTrainingById(id: string): Observable<Course | undefined> {
    return of(this.trainings.find(t => t.id === id));
  }
}
