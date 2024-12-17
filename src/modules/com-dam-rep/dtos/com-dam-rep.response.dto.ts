import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ComDamRepResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'PSC',
    description: 'MÃ BỘ PHẬN CONTAINER',
  })
  compCode: string;

  @ApiProperty({
    example: 'BN',
    description: 'MÃ HƯ HỎNG',
  })
  damCode: string;

  @ApiProperty({
    example: 'IX',
    description: 'MÃ SỬA CHỮA',
  })
  repCode: string;

  @ApiProperty({
    example: 'PANEL - FRONT END WHOLE CONTAINER IX - BURNED',
    description: 'TÊN TIẾNG ANH',
  })
  nameEn: string;

  @ApiPropertyOptional({
    example: 'VÁCH - MẶT TRƯỚC VỊ TRÍ BẤT KỲ IX - CHÁY',
    description: 'TÊN TIẾNG VIỆT',
  })
  nameVi?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ COM_DAM_REP',
    description: 'GHI CHÚ',
  })
  note?: string | null;
}
