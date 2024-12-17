import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { MnrOverNotFoundError } from '@modules/mnr-over/domain/mnr-over.error';
import { MnrOverResponseDto } from '@modules/mnr-over/dtos/mnr-over.response.dto';
import { MnrOverMapper } from '@modules/mnr-over/mappers/mnr-over.mapper';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindMnrOverQuery,
  FindMnrOverQueryResult,
} from './find-mnr-over.query-handler';

@Controller(routesV1.version)
export class FindMnrOverHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MnrOverMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.MNR_OVER.parent} - ${resourcesV1.MNR_OVER.displayName}`,
  )
  @ApiOperation({ summary: 'Find one MnrOver' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'MnrOver ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MnrOverResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MnrOverNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.MNR_OVER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.mnrOver.getOne)
  async findMnrOver(
    @Param('id') mnrOverId: bigint,
  ): Promise<MnrOverResponseDto> {
    const query = new FindMnrOverQuery(mnrOverId);
    const result: FindMnrOverQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (mnrOver) => this.mapper.toResponse(mnrOver),
      Err: (error) => {
        if (error instanceof MnrOverNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
