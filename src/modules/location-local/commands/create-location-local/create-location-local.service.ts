import { Err, Ok, Result } from 'oxide.ts';
import { LOCATION_LOCAL_REPOSITORY } from '@modules/location-local/location-local.di-tokens';
import { LocationLocalRepositoryPort } from '@modules/location-local/database/location-local.repository.port';
import { LocationLocalEntity } from '@modules/location-local/domain/location-local.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLocationLocalCommand } from './create-location-local.command';
import { ConflictException } from '@src/libs/exceptions';
import { LocationLocalCodeAlreadyExistsError } from '../../domain/location-local.error';

export type CreateLocationLocalServiceResult = Result<
  LocationLocalEntity,
  LocationLocalCodeAlreadyExistsError
>;

@CommandHandler(CreateLocationLocalCommand)
export class CreateLocationLocalService implements ICommandHandler {
  constructor(
    @Inject(LOCATION_LOCAL_REPOSITORY)
    protected readonly locationLocalRepo: LocationLocalRepositoryPort,
  ) {}

  async execute(
    command: CreateLocationLocalCommand,
  ): Promise<CreateLocationLocalServiceResult> {
    const locationLocal = LocationLocalEntity.create({
      ...command.getExtendedProps<CreateLocationLocalCommand>(),
    });

    try {
      const createdLocationLocal = await this.locationLocalRepo.insert(
        locationLocal,
      );
      return Ok(createdLocationLocal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new LocationLocalCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
