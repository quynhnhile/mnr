import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { LOCATION_LOCAL_REPOSITORY } from '@modules/location-local/location-local.di-tokens';
import { LocationLocalRepositoryPort } from '@modules/location-local/database/location-local.repository.port';
import { LocationLocalEntity } from '@modules/location-local/domain/location-local.entity';
import { LocationLocalNotFoundError } from '@modules/location-local/domain/location-local.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteLocationLocalCommand } from './delete-location-local.command';

export type DeleteLocationLocalServiceResult = Result<boolean, LocationLocalNotFoundError>;

@CommandHandler(DeleteLocationLocalCommand)
export class DeleteLocationLocalService implements ICommandHandler {
  constructor(
    @Inject(LOCATION_LOCAL_REPOSITORY)
    protected readonly locationLocalRepo: LocationLocalRepositoryPort,
  ) {}

  async execute(
    command: DeleteLocationLocalCommand,
  ): Promise<DeleteLocationLocalServiceResult> {
    try {
      const result = await this.locationLocalRepo.delete({
        id: command.locationLocalId,
      } as LocationLocalEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new LocationLocalNotFoundError(error));
      }

      throw error;
    }
  }
}
