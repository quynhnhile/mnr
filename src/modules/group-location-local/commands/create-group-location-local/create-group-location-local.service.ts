import { Err, Ok, Result } from 'oxide.ts';
import { GROUP_LOCATION_LOCAL_REPOSITORY } from '@modules/group-location-local/group-location-local.di-tokens';
import { GroupLocationLocalRepositoryPort } from '@modules/group-location-local/database/group-location-local.repository.port';
import { GroupLocationLocalEntity } from '@modules/group-location-local/domain/group-location-local.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateGroupLocationLocalCommand } from './create-group-location-local.command';
import { ConflictException } from '@src/libs/exceptions';
import { GroupLocationLocalCodeAlreadyExistError } from '../../domain/group-location-local.error';

export type CreateGroupLocationLocalServiceResult = Result<
  GroupLocationLocalEntity,
  GroupLocationLocalCodeAlreadyExistError
>;

@CommandHandler(CreateGroupLocationLocalCommand)
export class CreateGroupLocationLocalService implements ICommandHandler {
  constructor(
    @Inject(GROUP_LOCATION_LOCAL_REPOSITORY)
    protected readonly groupLocationLocalRepo: GroupLocationLocalRepositoryPort,
  ) {}

  async execute(
    command: CreateGroupLocationLocalCommand,
  ): Promise<CreateGroupLocationLocalServiceResult> {
    const groupLocationLocal = GroupLocationLocalEntity.create({
      ...command.getExtendedProps<CreateGroupLocationLocalCommand>(),
    });

    try {
      const createdGroupLocationLocal =
        await this.groupLocationLocalRepo.insert(groupLocationLocal);
      return Ok(createdGroupLocationLocal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new GroupLocationLocalCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
