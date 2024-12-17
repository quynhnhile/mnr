import { Err, Ok, Result } from 'oxide.ts';
import { LOCATION_REPOSITORY } from '@modules/location/location.di-tokens';
import { LocationRepositoryPort } from '@modules/location/database/location.repository.port';
import { LocationEntity } from '@modules/location/domain/location.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLocationCommand } from './create-location.command';
import { LocationCodeAlreadyExistsError } from '../../domain/location.error';
import { ConflictException } from '@src/libs/exceptions';

export type CreateLocationServiceResult = Result<
  LocationEntity,
  LocationCodeAlreadyExistsError
>;

@CommandHandler(CreateLocationCommand)
export class CreateLocationService implements ICommandHandler {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    protected readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(
    command: CreateLocationCommand,
  ): Promise<CreateLocationServiceResult> {
    const location = LocationEntity.create({
      ...command.getExtendedProps<CreateLocationCommand>(),
    });

    try {
      const createdLocation = await this.locationRepo.insert(location);
      return Ok(createdLocation);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new LocationCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
