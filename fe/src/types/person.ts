export interface PersonLite {
  // TODO: Update types after the backend API is ready
  id: string;
  fullName: string;
  position: string;
  isSupervisorAvailable: boolean;
  profilePictureUrl?: string;

  contact: {
    labName: string;
    phone: string;
    email: string;
  };
}

export interface PersonFull extends PersonLite {
  // TODO: Update types after the backend API is ready
  shortBio: string;
  longBio: string;
  degrees: string[];
  researchAreas: string[];
  teachingAssistants: string[];
  advisees: string[];

  academicLinks: {
    sinta: string;
    scopus: string;
    scholar: string;
  };
}
