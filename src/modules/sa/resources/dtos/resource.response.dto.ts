import { ApiPropertyOptional } from '@nestjs/swagger';
import ResourceRepresentation from '@src/libs/keycloak/defs/resource-representation';
import ScopeRepresentation from '@src/libs/keycloak/defs/scope-representation';

export class ResourceResponseDto {
  constructor(
    props: ResourceRepresentation & {
      scopes: Array<ScopeRepresentation & { enabled?: boolean }>;
    },
  ) {
    Object.assign(this, props);
  }

  @ApiPropertyOptional({
    example: '',
    description: 'ID MENU',
  })
  id?: string;

  @ApiPropertyOptional({
    example: 'sa-menuss',
    description: 'TÊN MENU',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Chức năng',
    description: 'TÊN HIỂN THỊ',
  })
  displayName?: string;

  @ApiPropertyOptional({
    example: {
      parent: ['Tác vụ'],
    },
    description: 'THUỘC TÍNH',
  })
  attributes?: { [index: string]: string[] };

  @ApiPropertyOptional({
    example: [
      {
        id: '5e4d2bbc-5483-4747-b865-8bbee107b202',
        name: 'view',
      },
      {
        id: 'b01513fb-130b-46af-989c-cfda304b5924',
        name: 'update',
      },
      {
        id: '5c28325d-77d4-4ce6-93bb-c358cdf38173',
        name: 'delete',
      },
      {
        id: 'e03a032b-697d-45ea-95d5-a74cb7373cf1',
        name: 'create',
      },
    ],
    description: 'HÀNH ĐỘNG CÓ THỂ THỰC HIỆN',
  })
  scopes?: ScopeRepresentation[];
}
