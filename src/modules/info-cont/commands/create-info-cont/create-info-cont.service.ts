import { Err, Ok, Result } from 'oxide.ts';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { InfoContEntity } from '@modules/info-cont/domain/info-cont.entity';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInfoContCommand } from './create-info-cont.command';
import { Validation } from '@src/libs/utils/validation';

export type CreateInfoContCommandResult = Result<
  InfoContEntity,
  OperationNotFoundError
>;

@CommandHandler(CreateInfoContCommand)
export class CreateInfoContService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(INFO_CONT_REPOSITORY)
    protected readonly infoContRepo: InfoContRepositoryPort,
    private readonly validation: Validation,
  ) {}

  async execute(
    command: CreateInfoContCommand,
  ): Promise<CreateInfoContCommandResult> {
    const props = command.getExtendedProps<CreateInfoContCommand>();
    const { operationCode } = props;

    if (operationCode) {
      const foundOperation = await this.operationRepo.findOneByCode(
        operationCode,
      );
      if (operationCode != '*' && foundOperation.isNone()) {
        return Err(new OperationNotFoundError());
      }
    }

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
    const infoCont = InfoContEntity.create(props);

    try {
      const createdInfoCont = await this.infoContRepo.insert(infoCont);
      return Ok(createdInfoCont);
    } catch (error: any) {
      throw error;
    }
  }
}
