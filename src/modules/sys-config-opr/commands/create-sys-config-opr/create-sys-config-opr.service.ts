import { Err, Ok, Result } from 'oxide.ts';
import { SYS_CONFIG_OPR_REPOSITORY } from '@modules/sys-config-opr/sys-config-opr.di-tokens';
import { SysConfigOprRepositoryPort } from '@modules/sys-config-opr/database/sys-config-opr.repository.port';
import { SysConfigOprEntity } from '@modules/sys-config-opr/domain/sys-config-opr.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSysConfigOprCommand } from './create-sys-config-opr.command';
import { OperationCodeAlreadyExistError } from '../../domain/sys-config-opr.error';

export type CreateSysConfigOprServiceResult = Result<
  SysConfigOprEntity,
  OperationCodeAlreadyExistError
>;

@CommandHandler(CreateSysConfigOprCommand)
export class CreateSysConfigOprService implements ICommandHandler {
  constructor(
    @Inject(SYS_CONFIG_OPR_REPOSITORY)
    protected readonly sysConfigOprRepo: SysConfigOprRepositoryPort,
  ) {}

  async execute(
    command: CreateSysConfigOprCommand,
  ): Promise<CreateSysConfigOprServiceResult> {
    const sysConfigOpr = SysConfigOprEntity.create({
      ...command.getExtendedProps<CreateSysConfigOprCommand>(),
    });

    try {
      const createdSysConfigOpr = await this.sysConfigOprRepo.insert(
        sysConfigOpr,
      );
      return Ok(createdSysConfigOpr);
    } catch (error: any) {
      if (error instanceof OperationCodeAlreadyExistError) {
        return Err(new OperationCodeAlreadyExistError());
      }
      throw error;
    }
  }
}
