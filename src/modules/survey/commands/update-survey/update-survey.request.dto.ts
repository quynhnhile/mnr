import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { SurveyInOut } from '@modules/survey/domain/survey.type';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstimateUpdateSurveyRequestDto } from '@src/modules/estimate/dtos/estimate-update-survey.request.dto';
import { LocalDmgDetailUpdateSurveyRequestDto } from '@src/modules/local-dmg-detail/dtos/local-dmg-detail-update-survey.request.dto';

export class UpdateSurveyRequestDto {
  @ApiPropertyOptional({
    example: 'E',
    description: 'E: Empty / F: Full',
  })
  @IsOptional()
  @IsIn(['E', 'F'])
  fe?: string;

  @ApiPropertyOptional({
    example: 'I',
    description: 'I: In / O: Out ',
    enum: SurveyInOut,
  })
  @IsOptionalNonNullable()
  @IsIn(['I', 'O'])
  isInOut?: SurveyInOut;

  @ApiPropertyOptional({
    example: '11/2021',
    description: 'năm sản xuất cont',
  })
  @IsOptional()
  @MaxLength(10)
  contAge?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Tinh trạng Vỏ Cont - BS_CONDITION',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  conditionCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Tình trạng Máy cont lạnh - BS_MACHINE',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  conditionMachineCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Phân loại Cont - BS_CLASSIFY',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  classifyCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Phương thức vệ sinh - BS_CLEAN_METHOD',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  cleanMethodCode?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Phương án vệ sinh - BS_CLEAN_MODE',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  cleanModeCode?: string;

  @ApiPropertyOptional({
    example: 1_000_000,
    description: 'Tiền cược',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deposit?: number;

  @ApiPropertyOptional({
    example: '123456',
    description: 'CLEAN VENDOR | REPAIR_VENDOR - BS_VENDOR',
  })
  @IsOptional()
  @MaxLength(50)
  vendorCode?: string;

  @ApiPropertyOptional({
    example: '',
    description:
      'ID dòng phiếu kiểm tra đối với cont Tank - required if contType = TANK',
  })
  @IsOptional()
  idCheck?: bigint;

  @ApiPropertyOptional({
    example: '',
    description:
      'Số phiếu kiểm tra đối với cont Tank - required if contType = TANK',
  })
  @IsOptional()
  @MaxLength(50)
  checkNo?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Giám định Tank bên ngoài',
  })
  @IsOptional()
  @IsBoolean()
  isTankOutside?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Giám định Tank bên trong',
  })
  @IsOptional()
  @IsBoolean()
  isTankInside?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Kiểm tra test 1 bar rò rỉ cont Tank',
  })
  @IsOptional()
  @IsBoolean()
  isTest1bar?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'Số giám định bên ngoài -  cont Tank, required if exist survey with isTankOutside = true and isTankInside = false and contType = TANK',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  preSurveyNo?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'LỘT TEM',
  })
  @IsOptional()
  @IsBoolean()
  isRemoveMark?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Số lượng tem',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  removeMark?: number;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GIÁM ĐỊNH LẠI',
  })
  @IsOptional()
  @IsBoolean()
  isRevice?: boolean;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'ĐÁNH DẤU SỐ SURVEY BỊ GIÁM ĐỊNH LẠI - required if isRevice = true',
  })
  @IsOptional()
  @ValidateIf((o) => o.isRevice)
  @IsNotEmpty()
  @MaxLength(50)
  altSurveyNo?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ KHI GIÁM ĐỊNH',
  })
  @IsOptional()
  noteSurvey?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ CONT',
  })
  @IsOptional()
  noteCont?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ HƯ HỎNG',
  })
  @IsOptional()
  noteDam?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ ĐẶC BIỆT',
  })
  @IsOptional()
  noteSpecialHandling?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ TỪ LỆNH HẠ RỖNG/LỆNH ĐÓNG RÚT CONT',
  })
  @IsOptional()
  noteEir?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ CONT LẠNH',
  })
  @IsOptional()
  noteMachine?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GHI CHÚ NỘI BỘ',
  })
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Đánh dấu phát sinh',
  })
  @IsOptional()
  @IsBoolean()
  isException?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'pti',
  })
  @IsOptional()
  @IsBoolean()
  pti?: boolean;

  @ApiPropertyOptional({
    type: [LocalDmgDetailUpdateSurveyRequestDto],
    description: 'Danh sách chi tiết hư hỏng nội bộ',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalDmgDetailUpdateSurveyRequestDto)
  localDmgDetails?: LocalDmgDetailUpdateSurveyRequestDto[];

  @ApiPropertyOptional({
    type: EstimateUpdateSurveyRequestDto,
    description: 'Thông tin báo giá',
  })
  @IsOptional()
  @IsObject()
  @Type(() => EstimateUpdateSurveyRequestDto)
  estimate?: EstimateUpdateSurveyRequestDto;
}
