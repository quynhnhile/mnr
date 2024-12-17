import { Err, Ok, Result } from 'oxide.ts';
import { LOCATION_LOCAL_REPOSITORY } from '@modules/location-local/location-local.di-tokens';
import { LocationLocalRepositoryPort } from '@modules/location-local/database/location-local.repository.port';
import { LocationLocalEntity } from '@modules/location-local/domain/location-local.entity';
import {
  LocationLocalCodeAlreadyExistsError,
  LocationLocalNotFoundError,
} from '@modules/location-local/domain/location-local.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLocationLocalCommand } from './update-location-local.command';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateLocationLocalServiceResult = Result<
  LocationLocalEntity,
  LocationLocalNotFoundError | LocationLocalCodeAlreadyExistsError
>;

@CommandHandler(UpdateLocationLocalCommand)
export class UpdateLocationLocalService implements ICommandHandler {
  constructor(
    @Inject(LOCATION_LOCAL_REPOSITORY)
    protected readonly locationLocalRepo: LocationLocalRepositoryPort,
  ) {}

  async execute(
    command: UpdateLocationLocalCommand,
  ): Promise<UpdateLocationLocalServiceResult> {
    const found = await this.locationLocalRepo.findOneById(
      command.locationLocalId,
    );
    if (found.isNone()) {
      return Err(new LocationLocalNotFoundError());
    }

    const locationLocal = found.unwrap();
    locationLocal.update({
      ...command.getExtendedProps<UpdateLocationLocalCommand>(),
    });

    try {
      const updatedLocationLocal = await this.locationLocalRepo.update(
        locationLocal,
      );
      return Ok(updatedLocationLocal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new LocationLocalCodeAlreadyExistsError());
      }
      throw error;
    }
  }
}
