import { match } from 'oxide.ts';
import { resourceScopes, resourcesV1 } from '@config/app.permission';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { AuthPermission } from '@libs/decorators/auth-permission.decorator';
import { ReqUser } from '@libs/decorators/request-user.decorator';
import { RequestUser } from '@modules/auth/domain/value-objects/request-user.value-object';
import { KeycloakAuthGuard, RolesGuard } from '@modules/auth/guards';
import { LocalDmgDetailEntity } from '@modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { LocalDmgDetailResponseDto } from '@modules/local-dmg-detail/dtos/local-dmg-detail.response.dto';
import { LocalDmgDetailMapper } from '@modules/local-dmg-detail/mappers/local-dmg-detail.mapper';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLocalDmgDetailCommand } from './create-local-dmg-detail.command';
import { CreateLocalDmgDetailRequestDto } from './create-local-dmg-detail.request.dto';
import { CreateLocalDmgDetailServiceResult } from './create-local-dmg-detail.service';

@Controller(routesV1.version)
export class CreateLocalDmgDetailHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: LocalDmgDetailMapper,
  ) {}

  @ApiTags(
    `${resourcesV1.LOCAL_DMG_DETAIL.parent} - ${resourcesV1.LOCAL_DMG_DETAIL.displayName}`,
  )
  @ApiOperation({ summary: 'Create a LocalDmgDetail' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'surveyId',
    description: 'Survey ID',
    type: 'string',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: LocalDmgDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @AuthPermission(resourcesV1.LOCAL_DMG_DETAIL.name, resourceScopes.CREATE)
  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Post(routesV1.localDmgDetail.create)
  async create(
    @ReqUser() user: RequestUser,
    @Param('surveyId') surveyId: bigint,
    @Body() body: CreateLocalDmgDetailRequestDto,
  ): Promise<LocalDmgDetailResponseDto> {
    const command = new CreateLocalDmgDetailCommand({
      ...body,
      idSurvey: surveyId,
      createdBy: user.id,
    });

    const result: CreateLocalDmgDetailServiceResult =
      await this.commandBus.execute(command);

    console.log(result);

    console.log('check result: ', result);
    return match(result, {
      Ok: (localDmgDetail: LocalDmgDetailEntity) =>
        this.mapper.toResponse(localDmgDetail),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
