export interface GroupLocationLocalProps {
  id?: bigint;
  // Add properties here
  groupLocLocalCode: string;
  groupLocLocalName: string;
  contType: string;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateGroupLocationLocalProps {
  // Add properties here
  groupLocLocalCode: string;
  groupLocLocalName: string;
  contType: string;
  note?: string | null;
  createdBy: string;
}

export interface UpdateGroupLocationLocalProps {
  // Add properties here
  groupLocLocalCode?: string | null;
  groupLocLocalName?: string | null;
  contType?: string | null;
  note?: string | null;
  updatedBy: string;
}
