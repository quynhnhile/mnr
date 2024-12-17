import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { REGION_REPOSITORY } from '@modules/region/region.di-tokens';
import { RegionRepositoryPort } from '@modules/region/database/region.repository.port';
import { RegionEntity } from '@modules/region/domain/region.entity';
import {
  RegionNotFoundError,
  RegionCodeAlreadyInUseError,
} from '@modules/region/domain/region.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRegionCommand } from './delete-region.command';

export type DeleteRegionServiceResult = Result<
  boolean,
  RegionNotFoundError | RegionCodeAlreadyInUseError
>;

@CommandHandler(DeleteRegionCommand)
export class DeleteRegionService implements ICommandHandler {
  constructor(
    @Inject(REGION_REPOSITORY)
    protected readonly regionRepo: RegionRepositoryPort,
  ) {}

  async execute(
    command: DeleteRegionCommand,
  ): Promise<DeleteRegionServiceResult> {
    const found = await this.regionRepo.findOneByIdWithInUseCount(
      command.regionId,
    );
    if (found.isNone()) {
      return Err(new RegionNotFoundError());
    }

    const region = found.unwrap();
    const deleteResult = region.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }
    try {
      const result = await this.regionRepo.delete({
        id: command.regionId,
      } as RegionEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new RegionNotFoundError(error));
      }

      throw error;
    }
  }
}
