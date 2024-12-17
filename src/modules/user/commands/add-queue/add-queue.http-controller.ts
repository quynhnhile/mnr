import { Result, match } from 'oxide.ts';
import { routesV1 } from '@config/app.routes';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { NotFoundException } from '@libs/exceptions';
import {
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddQueueCommand } from './add-queue.service';

@Controller(routesV1.version)
export class AddQueueUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'add queue for a user' })
  @ApiResponse({
    description: 'User queue',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: NotFoundException.message,
    type: ApiErrorResponse,
  })
  @Post(routesV1.user.addQueue)
  async addQueue(@Param('id') id: string): Promise<void> {
    const command = new AddQueueCommand({ userId: id });
    const result: Result<boolean, NotFoundException> =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof NotFoundException)
          throw new NotFoundHttpException(error.message);
        throw error;
      },
    });
  }
}
