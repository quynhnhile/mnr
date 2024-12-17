import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteObjectCommand } from './delete-object.command';
import { routesV1 } from '@src/configs/app.routes';
import { resourcesV1 } from '@src/configs/app.permission';
import { KeycloakAuthGuard } from '@src/modules/auth/guards';
import { DeleteObjectRequestDto } from './delete-object.request.dto';

@Controller(routesV1.version)
export class DeleteObjectHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiTags(`${resourcesV1.UPLOAD.parent} - ${resourcesV1.UPLOAD.displayName}`)
  @ApiOperation({ summary: 'Delete Object' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Object deleted',
  })
  @UseGuards(KeycloakAuthGuard)
  @Delete(routesV1.upload.deleteObject)
  async delete(@Body() body: DeleteObjectRequestDto): Promise<void> {
    const command = new DeleteObjectCommand({
      ...body,
    });
    return await this.commandBus.execute(command);
  }
}
