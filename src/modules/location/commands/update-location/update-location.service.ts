import { Err, Ok, Result } from 'oxide.ts';
import { LOCATION_REPOSITORY } from '@modules/location/location.di-tokens';
import { LocationRepositoryPort } from '@modules/location/database/location.repository.port';
import { LocationEntity } from '@modules/location/domain/location.entity';
import {
  LocationCodeAlreadyExistsError,
  LocationCodeAlreadyInUseError,
  LocationNotFoundError,
} from '@modules/location/domain/location.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLocationCommand } from './update-location.command';

export type UpdateLocationServiceResult = Result<
  LocationEntity,
  | LocationNotFoundError
  | LocationCodeAlreadyInUseError
  | LocationCodeAlreadyExistsError
>;

@CommandHandler(UpdateLocationCommand)
export class UpdateLocationService implements ICommandHandler {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    protected readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(
    command: UpdateLocationCommand,
  ): Promise<UpdateLocationServiceResult> {
    const found = await this.locationRepo.findOneByIdWithInUseCount(
      command.locationId,
    );
    if (found.isNone()) {
      return Err(new LocationNotFoundError());
    }

    const location = found.unwrap();
    const updateResult = location.update({
      ...command.getExtendedProps<UpdateLocationCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedLocation = await this.locationRepo.update(location);
      return Ok(updatedLocation);
    } catch (error: any) {
      throw error;
    }
  }
}
