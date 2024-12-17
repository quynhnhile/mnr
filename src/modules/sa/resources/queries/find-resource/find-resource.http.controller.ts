import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import {
  NotFoundException as NotFoundHttpException,
  Controller,
  Get,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindResourceQuery,
  FindResourceQueryHandler,
} from './find-resource.query-handler';
import { ResourceResponseDto } from '../../dtos/resource.response.dto';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { match } from 'oxide.ts';
import { ResourceNotFoundError } from '../../domain/resource.error';

@Controller(routesV1.version)
export class FindResourceHttpController {
  constructor(
    private readonly findResourceQueryHandler: FindResourceQueryHandler,
  ) {}

  @ApiTags(
    `${resourcesV1.RESOURCE.parent} - ${resourcesV1.RESOURCE.displayName}`,
  )
  @ApiOperation({ summary: 'Find one resource' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Resource id',
    type: 'string',
    required: true,
    example: 'e15f07fc-a6a3-406e-8057-56eb280375a0',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResourceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ResourceNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.RESOURCE.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.sa.resource.getOne)
  async findRole(
    @Param('id') resourceId: string,
  ): Promise<ResourceResponseDto> {
    const query = new FindResourceQuery(resourceId);
    const result = await this.findResourceQueryHandler.execute(query);

    return match(result, {
      Ok: (resourceResponseDto: ResourceResponseDto) => {
        return resourceResponseDto;
      },
      Err: (error: Error) => {
        if (error instanceof ResourceNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
