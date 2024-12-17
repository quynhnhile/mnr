import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOperationRequestDto {
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(10)
  operationCode: string;

  @ApiProperty({
    example: 'Zim Integrated Shipping Services Ltd',
    description: 'TÊN HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(100)
  operationName: string;

  // @ApiProperty({
  //   example: false,
  //   description: 'GIAO DỊCH EDO',
  // })
  // @IsNotEmpty()
  // @IsBoolean()
  // @Transform(({ value }) => value ?? false)
  // isEdo: boolean;

  // @ApiProperty({
  //   example: OperationType.LOCAL,
  //   description: 'GIAO DỊCH LF',
  //   enum: OperationType,
  // })
  // @IsNotEmpty()
  // @IsIn([OperationType.LOCAL, OperationType.FOREIGN])
  // isLocalForeign: OperationType;

  @ApiProperty({
    example: true,
    description: 'KÍCH HOẠT',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value ?? true)
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'chính sách hãng tàu',
    description: 'CHÍNH SÁCH HÃNG TÀU',
  })
  @IsOptional()
  @MaxLength(500)
  policyInfo?: string;

  @ApiPropertyOptional({
    example: 'VSHT',
    description: 'PHƯƠNG THỨC VỆ SINH',
  })
  @IsOptional()
  @MaxLength(50)
  cleanMethodCode?: string;
  // @ApiPropertyOptional({
  //   example: 'M',
  //   description: 'PHƯƠNG THỨC THANH TOÁN',
  // })
  // @IsOptional()
  // moneyCredit?: string;
}
