import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SurveyInOut } from '../domain/survey.type';

export class SurveyResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiPropertyOptional({
    example: '1',
    description: 'ID - DT_REPAIR_CONT',
  })
  idRep?: string;

  @ApiProperty({
    example: 'CMAU1234567',
    description: 'CONTAINER ID',
  })
  idCont: string;

  @ApiProperty({
    example: '123456',
    description: 'CONTAINER NO - BS_INFO_CONT',
  })
  containerNo: string;

  @ApiProperty({
    example: 'SUR12345',
    description: 'SURVEY NO - AUTO GENERATED WHEN CREATING',
  })
  surveyNo: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Số lệnh giao nhận TOPOVN',
  })
  eirNo?: string;

  @ApiPropertyOptional({
    example: 'E',
    description: 'E: Empty / F: Full',
  })
  fe?: string;

  @ApiProperty({
    example: 'I',
    description: 'I: In / O: Out ',
    enum: SurveyInOut,
  })
  isInOut: SurveyInOut;

  @ApiProperty({
    example: 'HCM',
    description: 'Location survey - BS_SURVEY_LOCATION',
  })
  surveyLocationCode: string;

  @ApiPropertyOptional({
    example: '2000',
    description: 'NĂM SẢN XUẤT VỎ',
  })
  contAge?: string;

  @ApiPropertyOptional({
    example: '2000',
    description: 'NĂM SẢN XUẤT MÁY',
  })
  machineAge?: string;

  @ApiPropertyOptional({
    example: 'THERMO-KING',
    description: 'HÃNG MÁY',
  })
  machineBrand?: string;

  @ApiPropertyOptional({
    example: '2016',
    description: 'ĐỜI MÁY',
  })
  machineModel?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Tinh trạng Vỏ Cont - BS_CONDITION',
  })
  conditionCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Tình trạng Máy cont lạnh - BS_MACHINE',
  })
  conditionMachineCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Phân loại Cont - BS_CLASSIFY',
  })
  classifyCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Phương thức vệ sinh - BS_CLEAN_METHOD',
  })
  cleanMethodCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Phương án vệ sinh - BS_CLEAN_MODE',
  })
  cleanModeCode?: string;

  @ApiPropertyOptional({
    example: 1_000_000,
    description: 'Tiền cược',
  })
  deposit?: number;

  @ApiPropertyOptional({
    example: '123456',
    description: 'CLEAN VENDOR | REPAIR_VENDOR - BS_VENDOR',
  })
  vendorCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'ID dòng phiếu kiểm tra đối với cont Tank - required if contType = TANK',
  })
  idCheck?: bigint;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'Số phiếu kiểm tra đối với cont Tank - required if contType = TANK',
  })
  checkNo?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Giám định Tank bên ngoài',
  })
  isTankOutside?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Giám định Tank bên trong',
  })
  isTankInside?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Kiểm tra test 1 bar rò rỉ cont Tank',
  })
  isTest1bar?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'Số giám định bên ngoài -  cont Tank, required if exist survey with isTankOutside = true and isTankInside = false and contType = TANK',
  })
  preSurveyNo?: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Ngày giám địn',
  })
  surveyDate: Date;

  @ApiProperty({
    example: '123456',
    description: 'Người giám định',
  })
  surveyBy: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày hoàn thành',
  })
  finishDate?: Date;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Người hoàn thành',
  })
  finishBy?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'LỘT TEM',
  })
  isRemoveMark?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description: 'LỘT TEM',
  })
  removeMark?: number;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GIÁM ĐỊNH LẠI',
  })
  isRevice?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'ĐÁNH DẤU SỐ SURVEY BỊ GIÁM ĐỊNH LẠI - required if isRevice = true',
  })
  altSurveyNo?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ KHI GIÁM ĐỊNH',
  })
  noteSurvey?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ CONT',
  })
  noteCont?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ HƯ HỎNG',
  })
  noteDam?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ ĐẶC BIỆT',
  })
  noteSpecialHandling?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ TỪ LỆNH HẠ RỖNG/LỆNH ĐÓNG RÚT CONT',
  })
  noteEir?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ CONT LẠNH',
  })
  noteMachine?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ NỘI BỘ',
  })
  note?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Đánh dấu phát sinh',
  })
  isException?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'pti',
  })
  pti?: boolean;
}
