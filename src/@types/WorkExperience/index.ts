export type WorkExperience = {
  company: string;
  workPeriod: WorkPeriod;
  logo: ImageMetadata;
  description?: string;
  roles?: WorkRole[];
};

export type WorkRole = {
  title: string;
  workPeriod: WorkPeriod;
  content?: string;
};

export type WorkPeriod = [Date, Date?];
