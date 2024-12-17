import { Err, Ok, Result } from 'oxide.ts';
import { SYS_CONFIG_OPR_REPOSITORY } from '@modules/sys-config-opr/sys-config-opr.di-tokens';
import { SysConfigOprRepositoryPort } from '@modules/sys-config-opr/database/sys-config-opr.repository.port';
import { SysConfigOprEntity } from '@modules/sys-config-opr/domain/sys-config-opr.entity';
import {
  OperationCodeAlreadyExistError,
  SysConfigOprNotFoundError,
} from '@modules/sys-config-opr/domain/sys-config-opr.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSysConfigOprCommand } from './update-sys-config-opr.command';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateSysConfigOprServiceResult = Result<
  SysConfigOprEntity,
  SysConfigOprNotFoundError | OperationCodeAlreadyExistError
>;

@CommandHandler(UpdateSysConfigOprCommand)
export class UpdateSysConfigOprService implements ICommandHandler {
  constructor(
    @Inject(SYS_CONFIG_OPR_REPOSITORY)
    protected readonly sysConfigOprRepo: SysConfigOprRepositoryPort,
  ) {}

  async execute(
    command: UpdateSysConfigOprCommand,
  ): Promise<UpdateSysConfigOprServiceResult> {
    const found = await this.sysConfigOprRepo.findOneById(
      command.sysConfigOprId,
    );
    if (found.isNone()) {
      return Err(new SysConfigOprNotFoundError());
    }

    const sysConfigOpr = found.unwrap();
    sysConfigOpr.update({
      ...command.getExtendedProps<UpdateSysConfigOprCommand>(),
    });

    try {
      const updatedSysConfigOpr = await this.sysConfigOprRepo.update(
        sysConfigOpr,
      );
      return Ok(updatedSysConfigOpr);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new OperationCodeAlreadyExistError());
      }
      throw error;
    }
  }
}
