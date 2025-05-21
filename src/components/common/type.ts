export interface PatientData {
  id?: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  weight?: number;
  height?: number;
  blood_group: string;
  blood_pressure: number;
  medical_notes?: string;
  insurance_provider?: string;
  insurance_id?: string;
}

export interface ExecuteQueryResult {
  success: boolean;
  data: unknown[];
  error: string | null;
}

export interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  weight: number;
  height: number;
  blood_group: string;
  blood_pressure: number;
  medical_notes: string;
  insurance_provider: string;
  insurance_id: string;
}

export interface MedicalRecord {
  id?: number;
  patient_id: number;
  medical_notes?: string;
  insurance_provider?: string;
  insurance_id?: string;
  created_at: string;
}