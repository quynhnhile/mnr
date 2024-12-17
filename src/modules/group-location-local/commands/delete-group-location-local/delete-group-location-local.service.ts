import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { GROUP_LOCATION_LOCAL_REPOSITORY } from '@modules/group-location-local/group-location-local.di-tokens';
import { GroupLocationLocalRepositoryPort } from '@modules/group-location-local/database/group-location-local.repository.port';
import {
  GroupLocationLocalCodeAlreadyInUseError,
  GroupLocationLocalNotFoundError,
} from '@modules/group-location-local/domain/group-location-local.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteGroupLocationLocalCommand } from './delete-group-location-local.command';

export type DeleteGroupLocationLocalServiceResult = Result<
  boolean,
  GroupLocationLocalNotFoundError | GroupLocationLocalCodeAlreadyInUseError
>;

@CommandHandler(DeleteGroupLocationLocalCommand)
export class DeleteGroupLocationLocalService implements ICommandHandler {
  constructor(
    @Inject(GROUP_LOCATION_LOCAL_REPOSITORY)
    protected readonly groupLocationLocalRepo: GroupLocationLocalRepositoryPort,
  ) {}

  async execute(
    command: DeleteGroupLocationLocalCommand,
  ): Promise<DeleteGroupLocationLocalServiceResult> {
    const found = await this.groupLocationLocalRepo.findOneByIdWithInUseCount(
      command.groupLocationLocalId,
    );
    if (found.isNone()) {
      return Err(new GroupLocationLocalNotFoundError());
    }

    const groupLocationLocal = found.unwrap();
    const deleteResult = groupLocationLocal.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.groupLocationLocalRepo.delete(
        groupLocationLocal,
      );
      return Ok(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return Err(new GroupLocationLocalNotFoundError(error));
      }

      throw error;
    }
  }
}
