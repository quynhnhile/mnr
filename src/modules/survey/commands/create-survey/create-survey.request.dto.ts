import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
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
import { CreateEstimateRequestDto } from '@modules/estimate/commands/create-estimate/create-estimate.request.dto';
import { SurveyInOut } from '@modules/survey/domain/survey.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLocalDmgDetailRequestDto } from '@src/modules/local-dmg-detail/commands/create-local-dmg-detail/create-local-dmg-detail.request.dto';
import { CreateSurveyDetailRequestDto } from '../create-survey-detail/create-survey-detail.request.dto';

export class CreateSurveyRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'BEAU5565497',
    description: 'CONTAINER NO - BS_INFO_CONT',
  })
  @IsNotEmpty()
  @MaxLength(20)
  containerNo: string;

  @ApiProperty({
    example: 'MSC',
    description: 'operation code',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiPropertyOptional({
    example: 'TOPOVN5565497',
    description: 'Số lệnh giao nhận TOPOVN',
  })
  @IsOptional()
  @MaxLength(50)
  eirNo?: string;

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
  @IsIn(['I', 'O'])
  isInOut: SurveyInOut;

  @ApiProperty({
    example: 'GATEA',
    description: 'Location survey - BS_SURVEY_LOCATION',
  })
  @IsNotEmpty()
  @MaxLength(50)
  surveyLocationCode: string;

  @ApiPropertyOptional({
    example: '10/2024',
    description: 'năm sản xuất cont',
  })
  @IsOptional()
  @MaxLength(10)
  contAge?: string;

  @ApiPropertyOptional({
    example: '09/2024',
    description: 'năm sản xuất máy',
  })
  @IsOptional()
  @MaxLength(10)
  machineAge?: string;

  @ApiPropertyOptional({
    example: 'THERMO-KING',
    description: 'hãng máy',
  })
  @IsOptional()
  @MaxLength(100)
  machineBrand?: string;

  @ApiPropertyOptional({
    example: '2016',
    description: 'đời máy',
  })
  @IsOptional()
  @MaxLength(100)
  machineModel?: string;

  @ApiPropertyOptional({
    example: 'C',
    description: 'Tinh trạng Vỏ Cont - BS_CONDITION',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  conditionCode?: string;

  @ApiPropertyOptional({
    example: 'D',
    description: 'Tình trạng Máy cont lạnh - BS_MACHINE',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  conditionMachineCode?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'Phân loại Cont - BS_CLASSIFY',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  classifyCode?: string;

  @ApiPropertyOptional({
    example: 'VSN',
    description: 'Phương thức vệ sinh - BS_CLEAN_METHOD',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  cleanMethodCode?: string;

  @ApiPropertyOptional({
    example: 'VSHC',
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
    example: 'VCMA',
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
    example: false,
    description: 'Giám định Tank bên ngoài',
  })
  @IsOptional()
  @IsBoolean()
  isTankOutside?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Giám định Tank bên trong',
  })
  @IsOptional()
  @IsBoolean()
  isTankInside?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Kiểm tra test 1 bar rò rỉ cont Tank',
  })
  @IsOptional()
  @IsBoolean()
  isTest1bar?: boolean;

  @ApiPropertyOptional({
    example: '',
    description:
      'Số giám định bên ngoài -  cont Tank, required if exist survey with isTankOutside = true and isTankInside = false and contType = TANK',
  })
  @IsOptional()
  @MaxLength(50)
  preSurveyNo?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  finishDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'finish by',
  })
  @IsOptional()
  @MaxLength(36)
  finishBy?: string;

  @ApiPropertyOptional({
    example: false,
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
    example: false,
    description: 'GIÁM ĐỊNH LẠI',
  })
  @IsOptional()
  @IsBoolean()
  isRevice?: boolean;

  @ApiPropertyOptional({
    example: '',
    description:
      'ĐÁNH DẤU SỐ SURVEY BỊ GIÁM ĐỊNH LẠI - required if isRevice = true',
  })
  @IsOptional()
  @ValidateIf((o) => o.isRevice)
  @IsNotEmpty()
  @MaxLength(50)
  altSurveyNo?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ KHI GIÁM ĐỊNH',
    description: 'GHI CHÚ KHI GIÁM ĐỊNH',
  })
  @IsOptional()
  noteSurvey?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ CONT',
    description: 'GHI CHÚ CONT',
  })
  @IsOptional()
  noteCont?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ HƯ HỎNG',
    description: 'GHI CHÚ HƯ HỎNG',
  })
  @IsOptional()
  noteDam?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ ĐẶC BIỆT',
    description: 'GHI CHÚ ĐẶC BIỆT',
  })
  @IsOptional()
  noteSpecialHandling?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ TỪ LỆNH HẠ RỖNG/LỆNH ĐÓNG RÚT CONT',
    description: 'GHI CHÚ TỪ LỆNH HẠ RỖNG/LỆNH ĐÓNG RÚT CONT',
  })
  @IsOptional()
  noteEir?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ CONT LẠNH',
    description: 'GHI CHÚ CONT LẠNH',
  })
  @IsOptional()
  noteMachine?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ NỘI BỘ',
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

  @ApiProperty({
    type: [CreateSurveyDetailRequestDto],
    description: 'Danh sách chi tiết survey',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyDetailRequestDto)
  surveyDetails?: CreateSurveyDetailRequestDto[];

  @ApiPropertyOptional({
    type: [CreateLocalDmgDetailRequestDto],
    description: 'Danh sách chi tiết hư hỏng nội bộ',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLocalDmgDetailRequestDto)
  localDmgDetails?: CreateLocalDmgDetailRequestDto[];

  @ApiPropertyOptional({
    type: CreateEstimateRequestDto,
    description: 'Thông tin báo giá',
  })
  @IsOptional()
  @IsObject()
  @Type(() => CreateEstimateRequestDto)
  estimate?: CreateEstimateRequestDto;
}
