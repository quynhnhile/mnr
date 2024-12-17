import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { LOCATION_REPOSITORY } from '@modules/location/location.di-tokens';
import { LocationRepositoryPort } from '@modules/location/database/location.repository.port';
import { LocationEntity } from '@modules/location/domain/location.entity';
import {
  LocationCodeAlreadyInUseError,
  LocationNotFoundError,
} from '@modules/location/domain/location.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteLocationCommand } from './delete-location.command';

export type DeleteLocationServiceResult = Result<
  boolean,
  LocationNotFoundError | LocationCodeAlreadyInUseError
>;

@CommandHandler(DeleteLocationCommand)
export class DeleteLocationService implements ICommandHandler {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    protected readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(
    command: DeleteLocationCommand,
  ): Promise<DeleteLocationServiceResult> {
    const found = await this.locationRepo.findOneByIdWithInUseCount(
      command.locationId,
    );
    if (found.isNone()) {
      return Err(new LocationNotFoundError());
    }

    const location = found.unwrap();
    const deleteResult = location.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }
    try {
      const result = await this.locationRepo.delete({
        id: command.locationId,
      } as LocationEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new LocationNotFoundError(error));
      }

      throw error;
    }
  }
}
