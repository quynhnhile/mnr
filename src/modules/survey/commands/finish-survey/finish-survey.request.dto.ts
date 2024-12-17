import { IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FinishSurveyRequestDto {
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
    example: 'D',
    description: 'Tình trạng Máy cont lạnh - BS_MACHINE',
  })
  @IsOptional()
  @MaxLength(50)
  conditionMachineCode?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'pti',
  })
  @IsOptional()
  @IsBoolean()
  pti?: boolean;

  @ApiPropertyOptional({
    example: 'GHI CHÚ CONT LẠNH',
    description: 'GHI CHÚ CONT LẠNH',
  })
  @IsOptional()
  noteMachine?: string;
}
