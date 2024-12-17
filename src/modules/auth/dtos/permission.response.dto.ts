import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({
    example: 'mnrcenter/reports/weekly_report',
    description: 'Resource name',
  })
  rsname: string;

  @ApiProperty({
    example: '2044ff26-94d7-479d-a585-4bbfc229cad3',
    description: 'Resource ID',
  })
  rsid: string;

  @ApiProperty({
    example: ['view', 'update', 'create', 'delete'],
    description: 'Scopes',
    type: [String],
  })
  scopes: string[];
}
