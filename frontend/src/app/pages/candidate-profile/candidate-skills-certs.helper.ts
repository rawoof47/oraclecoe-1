import { forkJoin } from 'rxjs';
import { CandidateProfileService } from '../../services/candidate-profile.service';

export interface Skill {
  id: string;
  name: string;
  selected?: boolean;
}

export interface Certification {
  id: string;
  certification_name: string;
  name?: string;
  selected?: boolean;
}

export const SKILL_CATEGORIES = {
  functional: '612222a1-791a-4125-be8d-1d86808a37bf',
  technical: 'b9677d69-356f-11f0-bd34-80ce6232908a',
  oracleMiddleware: '0ec31fb0-3591-11f0-ae4b-80ce6232908a',
  reporting: '843a8e1d-3591-11f0-ae4b-80ce6232908a',
};

export const CERT_CATEGORIES = {
  financial: 'ed7c50c7-36d3-11f0-bfce-80ce6232908a',
  hcm: 'ed7c5c88-36d3-11f0-bfce-80ce6232908a',
  scm: 'ed7c5da6-36d3-11f0-bfce-80ce6232908a',
  cx: 'ed7c5e82-36d3-11f0-bfce-80ce6232908a',
};

export function loadSkillsAndCertifications(
  service: CandidateProfileService,
  onSuccess: (skills: any[], certs: any[]) => void,
  onError: () => void
): void {
  const skillRequests = [
    service.getSkillsByCategory(SKILL_CATEGORIES.functional),
    service.getSkillsByCategory(SKILL_CATEGORIES.technical),
    service.getSkillsByCategory(SKILL_CATEGORIES.oracleMiddleware),
    service.getSkillsByCategory(SKILL_CATEGORIES.reporting),
  ];

  const certRequests = [
    service.getCertificationsByCategory(CERT_CATEGORIES.financial),
    service.getCertificationsByCategory(CERT_CATEGORIES.hcm),
    service.getCertificationsByCategory(CERT_CATEGORIES.scm),
    service.getCertificationsByCategory(CERT_CATEGORIES.cx),
  ];

  forkJoin([forkJoin(skillRequests), forkJoin(certRequests)]).subscribe({
    next: ([skills, certs]) => {
      const groupedSkills = [
        { categoryName: 'Functional Skills', items: skills[0].map(s => ({ ...s, selected: false })) },
        { categoryName: 'Technical Skills', items: skills[1].map(s => ({ ...s, selected: false })) },
        { categoryName: 'Oracle Middleware & Database Skills', items: skills[2].map(s => ({ ...s, selected: false })) },
        { categoryName: 'Analytics & Reporting', items: skills[3].map(s => ({ ...s, selected: false })) },
      ];

      const groupedCertifications = [
        { categoryName: 'Oracle ERP & Financials', items: certs[0].map(c => ({ ...c, name: c.certification_name, selected: false })) },
        { categoryName: 'Oracle HCM', items: certs[1].map(c => ({ ...c, name: c.certification_name, selected: false })) },
        { categoryName: 'Oracle Integration & Development', items: certs[2].map(c => ({ ...c, name: c.certification_name, selected: false })) },
        { categoryName: 'Oracle Infrastructure (OCI)', items: certs[3].map(c => ({ ...c, name: c.certification_name, selected: false })) },
      ];

      onSuccess(groupedSkills, groupedCertifications);
    },
    error: () => {
      onError();
    }
  });
}

export function toggleSkill(skill: Skill, selectedSkills: Skill[]): Skill[] {
  skill.selected = !skill.selected;
  const updatedList = skill.selected
    ? [...selectedSkills, skill]
    : selectedSkills.filter(s => s.id !== skill.id);

  return updatedList;
}

export function toggleCertification(cert: Certification, selectedCerts: Certification[]): Certification[] {
  cert.selected = !cert.selected;
  const updatedList = cert.selected
    ? [...selectedCerts, cert]
    : selectedCerts.filter(c => c.id !== cert.id);

  return updatedList;
}

export function getSkillsLabel(selectedSkills: Skill[]): string {
  const label = selectedSkills.length > 0
    ? `${selectedSkills.length} skill(s) selected`
    : 'Select Skills';

  return label;
}

export function getCertificationsLabel(selectedCerts: Certification[]): string {
  const label = selectedCerts.length > 0
    ? `${selectedCerts.length} certification(s) selected`
    : 'Select Certifications';

  return label;
}

export function saveSkills(
  userId: string,
  selectedSkills: Skill[],
  candidateProfileService: CandidateProfileService,
  onSuccess: () => void,
  onError: (error: any) => void
): void {
  const skillIds = selectedSkills.map(skill => skill.id);

  candidateProfileService.saveCandidateSkills(userId, skillIds).subscribe({
    next: () => {
      onSuccess();
    },
    error: (error) => {
      onError(error);
    }
  });
}

export function saveCertifications(
  userId: string,
  selectedCerts: Certification[],
  candidateProfileService: CandidateProfileService,
  onSuccess: () => void,
  onError: (error: any) => void
): void {
  const certificationIds = selectedCerts.map(cert => cert.id);

  candidateProfileService.saveCandidateCertifications(userId, certificationIds).subscribe({
    next: () => {
      onSuccess();
    },
    error: (error) => {
      onError(error);
    }
  });
}
