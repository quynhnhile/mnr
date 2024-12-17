import { routesV1 } from '@config/app.routes';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateSignedUrlResponseDto } from './create-signed-url.response.dto';
import { CreateSignedUrlRequestDto } from './create-signed-url.request.dto';
import { CreateSignedUrlCommand } from './create-signed-url.command';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KeycloakAuthGuard } from '@src/modules/auth/guards';
import { resourcesV1 } from '@src/configs/app.permission';

@Controller(routesV1.version)
export class CreateSignedUrlHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @ApiOperation({ summary: 'Create Url Storage Image' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateSignedUrlResponseDto,
  })
  @ApiTags(`${resourcesV1.UPLOAD.parent} - ${resourcesV1.UPLOAD.displayName}`)
  @UseGuards(KeycloakAuthGuard)
  @Post(routesV1.upload.createSignedUrl)
  async createSignedUrl(
    @Body() body: CreateSignedUrlRequestDto,
  ): Promise<CreateSignedUrlResponseDto> {
    const command = new CreateSignedUrlCommand({
      ...body,
    });

    return await this.commandBus.execute(command);
  }
}
