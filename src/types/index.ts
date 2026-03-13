export type Role = "admin" | "student" | string;

export interface Student {
  id: string;
  name: string;
  password: string;
  role: Role;
}

export interface Activity {
  id: string;
  date: string; // YYYY-MM-DD
  time_slot: string;
  location: string;
  created_at: Date | string;
}

export type AbsenceReason = "授業" | "体調不良" | "その他" | string;

export interface Absence {
  id: string;
  student_id: string;
  activity_id: string;
  reason: AbsenceReason;
  reason_detail: string | null;
  created_at: Date | string;
}

export interface AbsenceWithStudent extends Absence {
  student_name: string;
}

export interface ActivityWithAbsences extends Activity {
  absences: AbsenceWithStudent[];
}
