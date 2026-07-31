export interface PersonStudent extends PersonLite {
  studentIdNumber?: string;
  level?: "S1" | "S2" | "S3";
  isAdvisee: boolean;
  isTeachingAssistant: boolean;
  
  // Advisee specific
  thesisTitle?: string;
  supervisionRole?: string;
  adviseeStatus?: string;
  startDate?: string;
  endDate?: string;

  // TA specific
  courseName?: string;
  academicPeriod?: string;
  taStatus?: string;
}

export interface publication {
  title: string;
  link: string;
  type: string;
  date: string;
  peopleInvolved: string[];
  tags: string[];
}

export interface PersonLite {
  id: string;
  sourceId?: string;
  fullName: string;
  position: string;
  isSupervisorAvailable: boolean;
  profilePictureUrl?: string;

  contact: {
    labName?: string;
    email?: string;
  };
}

export interface PersonLecturer extends PersonLite {
  shortBio: string;
  longBio: string;
  degrees: string[];
  researchAreas: string[];
  teachingAssistants: PersonStudent[];
  advisees: PersonStudent[];

  academicLinks: {
    sinta: string;
    scopus: string;
    scholar: string;
  };

  publications: publication[];
  awards: string[];
}

