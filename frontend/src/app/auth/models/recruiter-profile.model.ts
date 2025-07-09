export interface Industry {
  id: string; // ✅ UUID = string
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RecruiterProfile {
  // define recruiter profile fields here...
}