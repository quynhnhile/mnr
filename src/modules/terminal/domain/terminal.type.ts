export interface TerminalProps {
  id?: bigint;
  regionCode: string;
  terminalCode: string;
  terminalName: string;
  terminalNameEng?: string | null;
  address?: string | null;
  vat?: string | null;
  email?: string | null;
  tel?: string | null;
  fax?: string | null;
  web?: string | null;
  hotlineInfo?: string | null;
  logoText?: string | null;
  logoHtml?: string | null;
  contactName?: string | null;
  contactGroupName?: string | null;
  contactTel?: string | null;
  contactZaloId?: string | null;
  contactFbId?: string | null;
  contactEmail?: string | null;
  isActive: boolean;
  note?: string | null;
  createdBy: string | null;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateTerminalProps {
  regionCode: string;
  terminalCode: string;
  terminalName: string;
  terminalNameEng?: string;
  address?: string;
  vat?: string;
  email?: string;
  tel?: string;
  fax?: string;
  web?: string;
  hotlineInfo?: string;
  logoText?: string;
  logoHtml?: string;
  contactName?: string;
  contactGroupName?: string;
  contactTel?: string;
  contactZaloId?: string;
  contactFbId?: string;
  contactEmail?: string;
  isActive: boolean;
  note?: string;
  createdBy: string | null;
}

export interface UpdateTerminalProps {
  regionCode?: string;
  terminalCode?: string;
  terminalName?: string;
  terminalNameEng?: string;
  address?: string;
  vat?: string;
  email?: string;
  tel?: string;
  fax?: string;
  web?: string;
  hotlineInfo?: string;
  logoText?: string;
  logoHtml?: string;
  contactName?: string;
  contactGroupName?: string;
  contactTel?: string;
  contactZaloId?: string;
  contactFbId?: string;
  contactEmail?: string;
  isActive?: boolean;
  note?: string;
  updatedBy: string;
}
