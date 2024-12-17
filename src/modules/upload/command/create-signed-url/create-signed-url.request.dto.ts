import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSignedUrlRequestDto {
  @ApiProperty({
    example: 'TEMU8121621',
    description: `SỐ CONTAINER`,
  })
  @IsNotEmpty()
  @MaxLength(50)
  containerNo: string;

  @ApiProperty({
    example: 'getin',
    enum: ['getin', 'getout'],
    description: `TÁC NGHIỆP`,
  })
  @IsNotEmpty()
  @MaxLength(50)
  jobTask: string;

  @ApiPropertyOptional({
    example: 'survey',
    enum: ['survey', 'repair', 'clean', 'PTI', 'araise'],
    description: `LOẠI PHÁT HIỆN`,
  })
  @IsOptional()
  @MaxLength(50)
  surveyType?: string;

  @ApiProperty({
    example: 'detail',
    enum: ['all', 'detail'],
    description: `MẶT`,
  })
  @IsNotEmpty()
  @MaxLength(50)
  side: string;

  @ApiPropertyOptional({
    example: 'HWR',
    description: `MÃ COM`,
  })
  @IsOptional()
  @MaxLength(50)
  com?: string;

  @ApiPropertyOptional({
    example: 'TX7N',
    description: `MÃ LOC`,
  })
  @IsOptional()
  @MaxLength(50)
  loc?: string;

  @ApiPropertyOptional({
    example: 'DT',
    description: `MÃ DAM`,
  })
  @IsOptional()
  @MaxLength(50)
  dam?: string;

  @ApiPropertyOptional({
    example: 'RP',
    description: `MÃ REP`,
  })
  @IsOptional()
  @MaxLength(50)
  rep?: string;

  @ApiPropertyOptional({
    example: '150',
    description: `CHIỀU DÀI`,
  })
  @IsOptional()
  @MaxLength(50)
  length?: string;

  @ApiPropertyOptional({
    example: '100',
    description: `CHIỀU RỘNG`,
  })
  @IsOptional()
  @MaxLength(50)
  width?: string;

  @ApiPropertyOptional({
    example: '2',
    description: `SỐ LƯỢNG`,
  })
  @IsOptional()
  @MaxLength(50)
  quantity?: string;

  @ApiProperty({
    example: 12,
    description: `TỔNG SỐ ẢNH`,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  imageTotal: number;
}

// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   MaxLength,
//   Min,
// } from 'class-validator';

// export class CreateSignedUrlRequestDto {
//   @ApiProperty({
//     example: 'TEMU8121621',
//     description: `SỐ CONTAINER`,
//   })
//   @IsNotEmpty()
//   @MaxLength(50)
//   containerNo: string;

//   @ApiProperty({
//     example: 'getin',
//     enum: ['getin', 'getout'],
//     description: `TÁC NGHIỆP`,
//   })
//   @IsNotEmpty()
//   @MaxLength(50)
//   jobTask: string;

//   @ApiPropertyOptional({
//     example: 'survey',
//     enum: ['survey', 'repair', 'clean', 'PTI', 'araise'],
//     description: `LOẠI PHÁT HIỆN`,
//   })
//   @IsOptional()
//   @MaxLength(50)
//   surveyType?: string;

//   @ApiProperty({
//     example: 'all',
//     enum: ['all', 'in', 'out'],
//     description: `MẶT`,
//   })
//   @IsNotEmpty()
//   @MaxLength(50)
//   side: string;

//   @ApiPropertyOptional({
//     example: 'HWR',
//     description: `MÃ COM`,
//   })
//   @IsOptional()
//   @MaxLength(50)
//   com?: string;

//   @ApiPropertyOptional({
//     example: 'TX7N',
//     description: `MÃ LOC`,
//   })
//   @IsOptional()
//   @MaxLength(50)
//   loc?: string;

//   @ApiPropertyOptional({
//     example: 'RP',
//     description: `MÃ REP`,
//   })
//   @IsOptional()
//   @MaxLength(50)
//   rep?: string;

//   @ApiProperty({
//     example: 12,
//     description: `TỔNG SỐ ẢNH`,
//   })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(1)
//   imageTotal: number;
// }
