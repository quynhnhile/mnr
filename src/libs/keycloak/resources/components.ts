import { KeycloakAdminClient } from '../client';
import ComponentRepresentation from '../defs/component-representation';
import ComponentTypeRepresentation from '../defs/component-type-representation';
import Resource from './resource';

export interface ComponentQuery {
  name?: string;
  parent?: string;
  type?: string;
}

export class Components extends Resource<{ realm?: string }> {
  /**
   * components
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_component_resource
   */
  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/components',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }

  public find = this.makeRequest<ComponentQuery, ComponentRepresentation[]>({
    method: 'GET',
  });

  public create = this.makeRequest<ComponentRepresentation, { id: string }>({
    method: 'POST',
    returnResourceIdInLocationHeader: { field: 'id' },
  });

  public findOne = this.makeRequest<
    { id: string },
    ComponentRepresentation | undefined
  >({
    method: 'GET',
    path: '/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  public update = this.makeUpdateRequest<
    { id: string },
    ComponentRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}',
    urlParamKeys: ['id'],
  });

  public del = this.makeRequest<{ id: string }, void>({
    method: 'DELETE',
    path: '/{id}',
    urlParamKeys: ['id'],
  });

  public listSubComponents = this.makeRequest<
    { id: string; type: string },
    ComponentTypeRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/sub-component-types',
    urlParamKeys: ['id'],
    queryParamKeys: ['type'],
  });
}
