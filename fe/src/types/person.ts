export interface teachingAssistant {
  fullName: string;
  profilePictureUrl?: string;

  contact: {
    email: string;
  };
}

export interface Advisee {
  id: string;
  fullName: string;
  level: "S1" | "S2" | "S3";
  project: string;
  researchArea: string;
  profileHref?: string;
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

export interface PersonFull extends PersonLite {
  shortBio: string;
  longBio: string;
  degrees: string[];
  researchAreas: string[];
  teachingAssistants: teachingAssistant[];
  advisees: Advisee[];

  academicLinks: {
    sinta: string;
    scopus: string;
    scholar: string;
  };

  publications: publication[];
  awards: string[];
}

