import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

function generateEstimateNo(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${datePart}${randomPart}`;
}

export class RepairContResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'NSSU7117749',
    description: 'ID CONTAINER',
  })
  idCont: string;

  @ApiProperty({
    example: '123456',
    description: 'CONTAINER NO',
  })
  containerNo: string;

  @ApiProperty({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiPropertyOptional({
    example: 'NDV24062503584-001',
    description: 'MÃ PIN',
  })
  pinCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ ORDER',
  })
  orderNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ BOOKING',
  })
  bookingNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ BL',
  })
  blNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'LOCATION',
  })
  location?: string;

  @ApiProperty({
    example: '',
    description: 'LOẠI KÍCH CỠ CỤC BỘ',
  })
  localSizeType: string;

  @ApiProperty({
    example: '',
    description: 'LOẠI KÍCH CỠ ISO',
  })
  isoSizeType: string;

  @ApiPropertyOptional({
    example: 'D',
    description: 'MÃ TÌNH TRẠNG CONTAINER TRƯỚC GIÁM ĐỊNH',
  })
  conditionCode?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'MÃ PHÂN LOẠI CONTAINER',
  })
  classifyCode?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'MÃ TÌNH TRẠNG MÁY TRƯỚC GIÁM ĐỊNH',
  })
  conditionMachineCode?: string;

  @ApiPropertyOptional({
    example: 'B',
    description: 'MÃ TÌNH TRẠNG CONTAINER SAU GIÁM ĐỊNH',
  })
  conditionCodeAfter?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'MÃ TÌNH TRẠNG MÁY SAU GIÁM ĐỊNH',
  })
  conditionMachineCodeAfter?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'NGÀY CONTAINER VÀO KV SỬA CHỮA/VS',
  })
  factoryDate?: Date;

  @ApiProperty({
    example: 'S',
    description: 'TRẠNG THÁI',
  })
  statusCode: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ SURVEY IN',
  })
  surveyInNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ SURVEY OUT',
  })
  surveyOutNo?: string;

  @ApiPropertyOptional({
    example: generateEstimateNo(),
    description: 'SỐ ESTIMATE',
  })
  estimateNo?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'ĐÃ HOÀN TÂT',
  })
  isComplete?: boolean;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'NGÀY HOÀN TẤT',
  })
  completeDate?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'ĐỐI TƯỢNG HOÀN TẤT',
  })
  completeBy?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'CHỐT SẢN LƯỢNG',
  })
  billCheck?: boolean;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'THỜI GIAN CHỐT SẢN LƯỢNG',
  })
  billDate?: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'HÃNG TÀU XÁC NHẬN CHỐT SẢN LƯỢNG',
  })
  billOprConfirm?: boolean;

  @ApiPropertyOptional({
    example: 'LÝ DO',
    description: 'LÝ DO HÃNG TÀU',
  })
  billOprReason?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'ĐÃ CHUYỂN KẾ TOÁN',
  })
  isPosted?: boolean;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  note?: string;
}
