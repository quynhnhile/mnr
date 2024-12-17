import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { SYS_CONFIG_OPR_REPOSITORY } from '@modules/sys-config-opr/sys-config-opr.di-tokens';
import { SysConfigOprRepositoryPort } from '@modules/sys-config-opr/database/sys-config-opr.repository.port';
import { SysConfigOprEntity } from '@modules/sys-config-opr/domain/sys-config-opr.entity';
import { SysConfigOprNotFoundError } from '@modules/sys-config-opr/domain/sys-config-opr.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSysConfigOprCommand } from './delete-sys-config-opr.command';

export type DeleteSysConfigOprServiceResult = Result<boolean, SysConfigOprNotFoundError>;

@CommandHandler(DeleteSysConfigOprCommand)
export class DeleteSysConfigOprService implements ICommandHandler {
  constructor(
    @Inject(SYS_CONFIG_OPR_REPOSITORY)
    protected readonly sysConfigOprRepo: SysConfigOprRepositoryPort,
  ) {}

  async execute(
    command: DeleteSysConfigOprCommand,
  ): Promise<DeleteSysConfigOprServiceResult> {
    try {
      const result = await this.sysConfigOprRepo.delete({
        id: command.sysConfigOprId,
      } as SysConfigOprEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new SysConfigOprNotFoundError(error));
      }

      throw error;
    }
  }
}
