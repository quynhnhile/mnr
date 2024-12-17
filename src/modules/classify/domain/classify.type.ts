export interface ClassifyProps {
  id?: bigint;
  // Add properties here
  operationCode: string;
  classifyCode: string;
  classifyName: string;
  mappingCode?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateClassifyProps {
  // Add properties here
  operationCode: string;
  classifyCode: string;
  classifyName: string;
  mappingCode?: string | null;
  note?: string;
  createdBy: string;
}

export interface UpdateClassifyProps {
  // Add properties here
  operationCode?: string;
  classifyCode?: string;
  classifyName?: string;
  mappingCode?: string;
  note?: string;
  updatedBy: string;
}
