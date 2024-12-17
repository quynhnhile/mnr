import { Err, Ok, Result } from 'oxide.ts';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { InfoContEntity } from '@modules/info-cont/domain/info-cont.entity';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateInfoContCommand } from './update-info-cont.command';
import { Validation } from '@src/libs/utils/validation';

export type UpdateInfoContCommandResult = Result<
  InfoContEntity,
  InfoContNotFoundError | OperationNotFoundError
>;

@CommandHandler(UpdateInfoContCommand)
export class UpdateInfoContService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(INFO_CONT_REPOSITORY)
    protected readonly infoContRepo: InfoContRepositoryPort,
    private readonly validation: Validation,
  ) {}

  async execute(
    command: UpdateInfoContCommand,
  ): Promise<UpdateInfoContCommandResult> {
    const found = await this.infoContRepo.findOneById(command.infoContId);
    if (found.isNone()) {
      return Err(new InfoContNotFoundError());
    }

    // Check if operation exists
    const props = command.getExtendedProps<UpdateInfoContCommand>();
    const { operationCode } = props;

    if (operationCode) {
      const foundOperation = await this.operationRepo.findOneByCode(
        operationCode,
      );
      if (operationCode != '*' && foundOperation.isNone()) {
        return Err(new OperationNotFoundError());
      }
    }
    if (command.containerNo) {
      const containerNo = await this.validation.checkMatchContainerNo(
        command.containerNo,
      );
      if (!containerNo) {
        return Promise.reject(
          new Error(
            'Sai định dạng container_no: 11 ký tự, 4 ký tự đầu là chữ cái in hoa từ A-Z, 7 ký tự sau là số từ 0-9',
          ),
        );
      }
    }

    const infoCont = found.unwrap();
    infoCont.update(props);

    try {
      const updatedInfoCont = await this.infoContRepo.update(infoCont);
      return Ok(updatedInfoCont);
    } catch (error: any) {
      throw error;
    }
  }
}
