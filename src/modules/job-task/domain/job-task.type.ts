export interface JobTaskProps {
  id?: bigint;
  // Add properties here
  jobTaskCode: string;
  jobTaskName: string;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateJobTaskProps {
  // Add properties here
  jobTaskCode: string;
  jobTaskName: string;
  note?: string | null;
  createdBy: string;
}

export interface UpdateJobTaskProps {
  // Add properties here
  jobTaskCode?: string;
  jobTaskName?: string;
  note?: string | null;
  updatedBy: string;
}
