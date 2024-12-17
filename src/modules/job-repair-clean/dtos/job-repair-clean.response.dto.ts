import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobRepairCleanResponseDto {
  @ApiProperty({
    example: '1',
    description: 'ID - JJOB_REPAIR_CLEAN',
  })
  id: string;
  @ApiProperty({
    example: '1',
    description: 'ID - DT_REPAIR_CONT',
  })
  idRef: string;

  @ApiProperty({
    example: 'CONT5565000',
    description: 'CONTAINER ID',
  })
  idCont: string;

  @ApiProperty({
    example: 'BEAU5565000',
    description: 'CONTAINER NO',
  })
  containerNo: string;

  @ApiProperty({
    example: '3',
    description: 'ID - DT_ESTIMATE_DETAIL',
  })
  idEstItem?: string;

  @ApiProperty({
    example: '202409186859',
    description: 'ESTIMATE NO - DT_ESTIMATE_DETAIL',
  })
  estimateNo: string;

  @ApiProperty({
    example: 'R2409180001',
    description: 'ID JOB - AUTO GENERATED WHEN CREATING',
  })
  idJob: string;

  @ApiProperty({
    example: '1',
    description: 'Seq',
  })
  seq: number;

  @ApiProperty({
    example: 'RM',
    description: 'REPAIR CODE',
  })
  repCode: string;

  @ApiProperty({
    example: false,
    description: 'IS CLEAN',
  })
  isClean?: boolean;

  @ApiPropertyOptional({
    example: 'VSHT',
    description: 'ClEAN METHOD CODE',
  })
  cleanMethodCode?: string | null;

  @ApiPropertyOptional({
    example: 'VSN',
    description: 'ClEAN MODE CODE',
  })
  cleanModeCode?: string | null;

  @ApiProperty({
    example: 'R',
    description: 'JOB STATUS',
  })
  jobStatus: string;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'START DATE',
  })
  startDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'START BY',
  })
  startBy?: string | null;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'FINISH DATE',
  })
  finishDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user test 1',
    description: 'START BY',
  })
  finishBy?: string | null;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'CANCEL DATE',
  })
  cancelDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user test 2',
    description: 'CANCEL BY',
  })
  cancelBy?: string | null;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'COMPLETE DATE',
  })
  completeDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user test 3',
    description: 'COMPLETE BY',
  })
  completeBy?: string | null;

  @ApiPropertyOptional({
    example: 'VZIM',
    description: 'VENDOR CODE',
  })
  vendorCode?: string | null;

  @ApiProperty({
    example: false,
    description: 'IS RECLEAN',
  })
  isReclean: boolean;

  @ApiProperty({
    example: 2,
    description: 'IS REF RECLEAN - ID JOB_REPAIR_CLEAN',
  })
  idRefReclean?: string | null;

  @ApiPropertyOptional({
    example: 'note reclean reason 123',
    description: 'RECLEAN REASON',
  })
  recleanReason?: string | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'KSC STATUS',
  })
  kcsStatus?: number | null;

  @ApiPropertyOptional({
    example: 'note kcs 123',
    description: 'KSC NOTE',
  })
  kcsNote?: string | null;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  note?: string | null;
}
