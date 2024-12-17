export interface AgentProps {
  id?: string;
  operationCode: string;
  agentCode: string;
  agentName: string;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateAgentProps {
  operationCode: string;
  agentCode: string;
  agentName: string;
  createdBy: string;
}

export interface UpdateAgentProps {
  operationCode?: string;
  agentCode?: string;
  agentName?: string;
  updatedBy: string;
}

export enum OperationType {
  LOCAL = 'L',
  FOREIGN = 'F',
}

export type AgentObject = {
  agentCode: string;
  agentName: string;
};
