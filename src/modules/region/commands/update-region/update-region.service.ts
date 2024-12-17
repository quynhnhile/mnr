import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { RegionRepositoryPort } from '@modules/region/database/region.repository.port';
import { RegionEntity } from '@modules/region/domain/region.entity';
import {
  RegionCodeAlreadyExistsError,
  RegionNotFoundError,
  RegionCodeAlreadyInUseError,
} from '@modules/region/domain/region.error';
import { REGION_REPOSITORY } from '@modules/region/region.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRegionCommand } from './update-region.command';

export type UpdateRegionServiceResult = Result<
  RegionEntity,
  | RegionNotFoundError
  | RegionCodeAlreadyExistsError
  | RegionCodeAlreadyInUseError
>;

@CommandHandler(UpdateRegionCommand)
export class UpdateRegionService implements ICommandHandler {
  constructor(
    @Inject(REGION_REPOSITORY)
    protected readonly regionRepo: RegionRepositoryPort,
  ) {}

  async execute(
    command: UpdateRegionCommand,
  ): Promise<UpdateRegionServiceResult> {
    const found = await this.regionRepo.findOneById(command.regionId);
    if (found.isNone()) {
      return Err(new RegionNotFoundError());
    }

    const region = found.unwrap();
    const updateResult = region.update({
      ...command.getExtendedProps<UpdateRegionCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedRegion = await this.regionRepo.update(region);
      return Ok(updatedRegion);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new RegionCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
