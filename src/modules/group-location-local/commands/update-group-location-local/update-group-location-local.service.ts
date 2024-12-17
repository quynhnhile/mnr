import { Err, Ok, Result } from 'oxide.ts';
import { GROUP_LOCATION_LOCAL_REPOSITORY } from '@modules/group-location-local/group-location-local.di-tokens';
import { GroupLocationLocalRepositoryPort } from '@modules/group-location-local/database/group-location-local.repository.port';
import { GroupLocationLocalEntity } from '@modules/group-location-local/domain/group-location-local.entity';
import {
  GroupLocationLocalCodeAlreadyExistError,
  GroupLocationLocalCodeAlreadyInUseError,
  GroupLocationLocalNotFoundError,
} from '@modules/group-location-local/domain/group-location-local.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateGroupLocationLocalCommand } from './update-group-location-local.command';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateGroupLocationLocalServiceResult = Result<
  GroupLocationLocalEntity,
  | GroupLocationLocalNotFoundError
  | GroupLocationLocalCodeAlreadyInUseError
  | GroupLocationLocalCodeAlreadyExistError
>;

@CommandHandler(UpdateGroupLocationLocalCommand)
export class UpdateGroupLocationLocalService implements ICommandHandler {
  constructor(
    @Inject(GROUP_LOCATION_LOCAL_REPOSITORY)
    protected readonly groupLocationLocalRepo: GroupLocationLocalRepositoryPort,
  ) {}

  async execute(
    command: UpdateGroupLocationLocalCommand,
  ): Promise<UpdateGroupLocationLocalServiceResult> {
    const found = await this.groupLocationLocalRepo.findOneByIdWithInUseCount(
      command.groupLocationLocalId,
    );
    if (found.isNone()) {
      return Err(new GroupLocationLocalNotFoundError());
    }

    const groupLocationLocal = found.unwrap();
    groupLocationLocal.update({
      ...command.getExtendedProps<UpdateGroupLocationLocalCommand>(),
    });

    try {
      const updatedGroupLocationLocal =
        await this.groupLocationLocalRepo.update(groupLocationLocal);
      return Ok(updatedGroupLocationLocal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new GroupLocationLocalCodeAlreadyExistError());
      }
      throw error;
    }
  }
}
