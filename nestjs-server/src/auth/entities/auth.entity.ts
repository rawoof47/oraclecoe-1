// src/auth/entities/auth.entity.ts
export class AuthEntity {
  email: string;
  uuid: string;
  role: 'candidate' | 'recruiter' | 'admin';
  token: string;
}
