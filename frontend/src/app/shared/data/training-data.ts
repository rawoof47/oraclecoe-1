// src/app/shared/data/training-data.ts
import { Course } from '../models/training.model';

export const COURSES: Course[] = [
  {
    id: 'financials',
    name: 'Fusion Financials',
    description: 'GL, AP, AR, Assets, Tax, Cash, and more. With reporting & workflows.',
    preferredFor: 'Finance Professionals, Accountants',
    modes: {
      online: {
        duration: '6 Weeks',
        fee: '₹12,000',
        permonth: '',
        content: '',
        highlights: ['Real-Time Projects', 'Weekend Batches', 'Interview Q&A']
      },
      office: {
        duration: '4 Weeks',
        fee: '₹15,000',
        permonth: '',
        content: '',
        highlights: ['Hands-on Labs', 'Live Instructor', 'Placement Support']
      },
      hybrid: {
        duration: '5 Weeks',
        fee: '₹13,500',
        permonth: '',
        content: '',
        highlights: ['Flexible Schedule', 'Combination Delivery', 'Support Portal']
      }
    }
  },
  {
    id: 'scm',
    name: 'Fusion SCM',
    description: 'Procurement, Inventory, Order Management & Supply Planning.',
    preferredFor: 'Supply Chain Professionals',
    modes: {
      online: {
        duration: '6 Weeks',
        fee: '₹11,500',
        permonth: '',
        content: '',
        highlights: ['Recordings Provided', 'Weekend Access', 'Practical Scenarios']
      },
      office: {
        duration: '4 Weeks',
        fee: '₹14,000',
        permonth: '',
        content: '',
        highlights: ['Batch Projects', 'Tools Training', 'Expert Sessions']
      },
      hybrid: {
        duration: '5 Weeks',
        fee: '₹13,000',
        permonth: '',
        content: '',
        highlights: ['Mix Mode Learning', 'Doubt Clearing', 'Tools Access']
      }
    }
  },
  {
    id: 'hcm',
    name: 'Fusion HCM',
    description: 'Core HR, Payroll, Absence, Benefits, and HR Analytics.',
    preferredFor: 'HR Professionals, PeopleSoft Users',
    modes: {
      online: {
        duration: '6 Weeks',
        fee: '₹11,000',
        permonth: '',
        content: '',
        highlights: ['Live HRMS Scenarios', 'Mock Interviews', 'Weekend Classes']
      },
      office: {
        duration: '4 Weeks',
        fee: '₹13,500',
        permonth: '',
        content: '',
        highlights: ['Practical HR Labs', 'Expert Trainers', 'Placement Guidance']
      },
      hybrid: {
        duration: '5 Weeks',
        fee: '₹12,250',
        permonth: '',
        content: '',
        highlights: ['Flexible Schedule', 'Hands-on HRMS', 'Certification Support']
      }
    }
  },
  {
    id: 'ppm',
    name: 'Fusion PPM',
    description: 'Project costing, billing, planning & integration with Financials.',
    preferredFor: 'Project Managers, Finance Professionals',
    modes: {
      online: {
        duration: '5 Weeks',
        fee: '₹10,500',
        permonth: '',
        content: '',
        highlights: ['Real Project Mapping', 'Weekend Flexibility', 'Assessment Quizzes']
      },
      office: {
        duration: '4 Weeks',
        fee: '₹13,000',
        permonth: '',
        content: '',
        highlights: ['On-Site Practice', 'Tools Hands-on', 'Daily Reporting Tasks']
      },
      hybrid: {
        duration: '4.5 Weeks',
        fee: '₹11,500',
        permonth: '',
        content: '',
        highlights: ['Combined Mode', 'Project Examples', 'Doubt Clearance']
      }
    }
  },
  {
    id: 'oic-bip',
    name: 'OIC & BI Publisher',
    description: 'Build integrations and custom reports using OIC & BIP tools.',
    preferredFor: 'Tech Developers, Integration Consultants',
    modes: {
      online: {
        duration: '6 Weeks',
        fee: '₹12,500',
        permonth: '',
        content: '',
        highlights: ['Integration Scenarios', 'Real Reports', 'Project Demos']
      },
      office: {
        duration: '4 Weeks',
        fee: '₹15,000',
        permonth: '',
        content: '',
        highlights: ['Live OIC Labs', 'Hands-on Report Design', 'Team Projects']
      },
      hybrid: {
        duration: '5 Weeks',
        fee: '₹13,500',
        permonth: '',
        content: '',
        highlights: ['Online + Office', 'Guided Projects', 'Resume Building']
      }
    }
  },
  {
    id: 'fullstack',
    name: 'Full Stack Development (MEAN + MERN)',
    description: 'Complete Full Stack web development with MEAN and MERN stack, including frontend and backend frameworks.',
    preferredFor: 'Aspiring Developers, Engineers',
    modes: {
      online: {
        duration: '8 Weeks',
        fee: '₹18,000',
        permonth: '',
        content: '',
        highlights: ['Angular + React Projects', 'MongoDB + MySQL', 'REST API Hands-on']
      },
      office: {
        duration: '6 Weeks',
        fee: '₹20,000',
        permonth: '',
        content: '',
        highlights: ['In-Person Code Reviews', 'Team Collaboration', 'Daily Assignments']
      },
      hybrid: {
        duration: '7 Weeks',
        fee: '₹19,000',
        permonth: '',
        content: '',
        highlights: ['Best of Both Modes', 'Dedicated Mentors', 'Placement Support']
      }
    }
  }
];
