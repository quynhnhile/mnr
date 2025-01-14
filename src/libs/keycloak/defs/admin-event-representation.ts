import AuthDetailsRepresentation from './auth-details-representation';

export default interface AdminEventRepresentation {
  authDetails?: AuthDetailsRepresentation;
  error?: string;
  operationType?: string;
  realmId?: string;
  representation?: string;
  resourcePath?: string;
  resourceType?: string;
  time?: number;
}
