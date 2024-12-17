import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstimateDetailResponseDto } from '@src/modules/estimate/dtos/estimate-detail.response.dto';

export class QueryInfoContByContNoOrEstimateNoResponseDto {
  @ApiProperty({
    example: 'DFSU7723129',
    description: 'Số Contanier',
  })
  containerNo: string;

  @ApiProperty({
    example: '123123123',
    description: 'Số order',
  })
  orderNo: string;

  @ApiProperty({
    example: 'MSC',
    description: 'Mã hãng tàu',
  })
  operationCode: string;

  @ApiProperty({
    example: 4500,
    description: 'Kích cỡ nội bộ',
  })
  localSizeType: string;

  @ApiProperty({
    example: 'G18-14-06-1',
    description: 'vị trí bãi',
  })
  location: string;

  @ApiProperty({
    example: 'S',
    description: 'Trạng thái container',
  })
  containerStatusCode: string;

  @ApiProperty({
    example: 'B',
    description: 'phân loại container',
  })
  conditionCode: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày vào bãi',
  })
  dateIn?: Date;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'Ghi chú giám định',
  })
  noteSurvey?: string;

  @ApiProperty({
    example: 'E2411010004',
    description: 'Số báo giá',
  })
  estimateNo: string;

  @ApiProperty({
    example: 'A',
    description: 'ĐÁNH DẤU TRẠNG THÁI GIÁM ĐINH;BAO GIA; SUA CHUA',
  })
  statusCode: string;

  @ApiPropertyOptional({
    example: 'note estimate 123',
    description: 'Ghi chú báo giá',
  })
  noteEstimate?: string;

  @ApiPropertyOptional({
    example: 1_000_000,
    description: 'Tiền cược',
  })
  deposit?: number;

  @ApiProperty({
    type: EstimateDetailResponseDto,
    isArray: true,
    example: [],
    description: 'DANH SÁCH CHI TIẾT BÁO GIÁ',
  })
  estimateDetails: EstimateDetailResponseDto[];
}
