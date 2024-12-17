import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { PayerNotFoundError } from '@modules/payer/domain/payer.error';
import { PayerResponseDto } from '@modules/payer/dtos/payer.response.dto';
import { PayerMapper } from '@modules/payer/mappers/payer.mapper';
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
  FindPayerQuery,
  FindPayerQueryResult,
} from './find-payer.query-handler';

@Controller(routesV1.version)
export class FindPayerHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: PayerMapper,
  ) {}

  @ApiTags(`${resourcesV1.PAYER.parent} - ${resourcesV1.PAYER.displayName}`)
  @ApiOperation({ summary: 'Find one Payer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Payer ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PayerNotFoundError.message,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.PAYER.name, resourceScopes.VIEW)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Get(routesV1.payer.getOne)
  async findPayer(@Param('id') payerId: bigint): Promise<PayerResponseDto> {
    const query = new FindPayerQuery(payerId);
    const result: FindPayerQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (payer) => this.mapper.toResponse(payer),
      Err: (error) => {
        if (error instanceof PayerNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
