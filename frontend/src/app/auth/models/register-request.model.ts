export interface RegisterRequest {
  email: string;
  mobile_number: string;
  password_hash: string; // Must match exactly
  role_id: string;
  status_id: string;
}
