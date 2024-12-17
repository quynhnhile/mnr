import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindResourcesQueryHandler,
  FindResourcesQuery,
} from './find-resources.query-handler';
import { ResourcePaginatedResponseDto } from '../../dtos/resource.paginated.response.dto';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';

@Controller(routesV1.version)
export class FindResourcesHttpController {
  constructor(
    private readonly findResourceQueryHandler: FindResourcesQueryHandler,
  ) {}

  @ApiTags(
    `${resourcesV1.RESOURCE.parent} - ${resourcesV1.RESOURCE.displayName}`,
  )
  @ApiOperation({ summary: 'Find Resources' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResourcePaginatedResponseDto,
  })
  @AuthPermission(resourcesV1.RESOURCE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.resource.root)
  async findResources(): Promise<ResourceResponseDto[]> {
    new FindResourcesQuery();
    return await this.findResourceQueryHandler.execute();
  }
}
