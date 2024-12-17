import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { RegionRepositoryPort } from '@modules/region/database/region.repository.port';
import { RegionEntity } from '@modules/region/domain/region.entity';
import { RegionCodeAlreadyExistsError } from '@modules/region/domain/region.error';
import { REGION_REPOSITORY } from '@modules/region/region.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRegionCommand } from './create-region.command';

export type CreateRegionServiceResult = Result<
  RegionEntity,
  RegionCodeAlreadyExistsError
>;

@CommandHandler(CreateRegionCommand)
export class CreateRegionService implements ICommandHandler {
  constructor(
    @Inject(REGION_REPOSITORY)
    protected readonly regionRepo: RegionRepositoryPort,
  ) {}

  async execute(
    command: CreateRegionCommand,
  ): Promise<CreateRegionServiceResult> {
    const region = RegionEntity.create({
      ...command.getExtendedProps<CreateRegionCommand>(),
    });

    try {
      const createdRegion = await this.regionRepo.insert(region);
      return Ok(createdRegion);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new RegionCodeAlreadyExistsError(error));
      }

      throw error;
    }
  }
}
