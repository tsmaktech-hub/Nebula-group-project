
export interface User {
  name: string;
  courseCode: string;
  username: string;
  password?: string;
}

export interface Student {
  id: string;
  name: string;
  matricNo: string;
  attendancePercentage: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  semester: number;
}

export interface Department {
  id: string;
  name: string;
  levels: number[];
  courses: Record<number, Course[]>;
}

export interface College {
  id: string;
  name: string;
  departments: Department[];
}

export interface AttendanceRecord {
  courseCode: string;
  studentId: string;
  week: number;
  present: boolean;
}
