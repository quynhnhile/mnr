import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Terminal as TerminalModel } from '@prisma/client';
import { TerminalEntity } from '../domain/terminal.entity';
import { TerminalResponseDto } from '../dtos/terminal.response.dto';

@Injectable()
export class TerminalMapper
  implements Mapper<TerminalEntity, TerminalModel, TerminalResponseDto>
{
  toPersistence(entity: TerminalEntity): TerminalModel {
    const copy = entity.getProps();
    const record: TerminalModel = {
      id: copy.id,
      regionCode: copy.regionCode,
      terminalCode: copy.terminalCode,
      terminalName: copy.terminalName,
      terminalNameEng: copy.terminalNameEng || null,
      address: copy.address || null,
      vat: copy.vat || null,
      email: copy.email || null,
      tel: copy.tel || null,
      fax: copy.fax || null,
      web: copy.web || null,
      hotlineInfo: copy.hotlineInfo || null,
      logoText: copy.logoText || null,
      logoHtml: copy.logoHtml || null,
      contactName: copy.contactName || null,
      contactGroupName: copy.contactGroupName || null,
      contactTel: copy.contactTel || null,
      contactZaloId: copy.contactZaloId || null,
      contactFbId: copy.contactFbId || null,
      contactEmail: copy.contactEmail || null,
      isActive: copy.isActive,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: TerminalModel & { inUseCount?: number }): TerminalEntity {
    return new TerminalEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        regionCode: record.regionCode,
        terminalCode: record.terminalCode,
        terminalName: record.terminalName,
        terminalNameEng: record.terminalNameEng || null,
        address: record.address || null,
        vat: record.vat || null,
        email: record.email || null,
        tel: record.tel || null,
        fax: record.fax || null,
        web: record.web || null,
        hotlineInfo: record.hotlineInfo || null,
        logoText: record.logoText || null,
        logoHtml: record.logoHtml || null,
        contactName: record.contactName || null,
        contactGroupName: record.contactGroupName || null,
        contactTel: record.contactTel || null,
        contactZaloId: record.contactZaloId || null,
        contactFbId: record.contactFbId || null,
        contactEmail: record.contactEmail || null,
        isActive: record.isActive,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: TerminalEntity): TerminalResponseDto {
    const props = entity.getProps();
    const response = new TerminalResponseDto(entity);
    response.regionCode = props.regionCode;
    response.terminalCode = props.terminalCode;
    response.terminalName = props.terminalName;
    response.terminalNameEng = props.terminalNameEng || undefined;
    response.address = props.address || undefined;
    response.vat = props.vat || undefined;
    response.email = props.email || undefined;
    response.fax = props.fax || undefined;
    response.web = props.web || undefined;
    response.hotlineInfo = props.hotlineInfo || undefined;
    response.logoText = props.logoText || undefined;
    response.logoHtml = props.logoHtml || undefined;
    response.contactName = props.contactName || undefined;
    response.contactGroupName = props.contactGroupName || undefined;
    response.contactTel = props.contactTel || undefined;
    response.contactZaloId = props.contactZaloId || undefined;
    response.contactFbId = props.contactFbId || undefined;
    response.contactEmail = props.contactEmail || undefined;
    response.isActive = props.isActive;
    response.note = props.note || undefined;

    return response;
  }
}
