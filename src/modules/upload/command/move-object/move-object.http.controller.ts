import { routesV1 } from '@config/app.routes';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MoveObjectResponseDto } from './move-object.response.dto';
import { MoveObjectRequestDto } from './move-object.request.dto';
import { MoveObjectCommand } from './move-object.command';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KeycloakAuthGuard } from '@src/modules/auth/guards';
import { resourcesV1 } from '@src/configs/app.permission';

@Controller(routesV1.version)
export class MoveObjectHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @ApiOperation({ summary: 'Move Object' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: MoveObjectResponseDto,
  })
  @ApiTags(`${resourcesV1.UPLOAD.parent} - ${resourcesV1.UPLOAD.displayName}`)
  @UseGuards(KeycloakAuthGuard)
  @Post(routesV1.upload.moveObject)
  async moveObject(
    @Body() body: MoveObjectRequestDto,
  ): Promise<MoveObjectResponseDto> {
    const command = new MoveObjectCommand({
      ...body,
    });

    return await this.commandBus.execute(command);
  }
}
