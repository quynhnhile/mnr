/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_eventrepresentation
 */
import EventType from './event-types';

export default interface EventRepresentation {
  clientId?: string;
  details?: Record<string, any>;
  error?: string;
  ipAddress?: string;
  realmId?: string;
  sessionId?: string;
  time?: number;
  type?: EventType;
  userId?: string;
}
