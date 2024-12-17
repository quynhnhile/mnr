import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../dtos/permission.response.dto';

export class GetPermissionsResponseDto {
  @ApiProperty({ type: PermissionResponseDto, isArray: true })
  readonly data: readonly PermissionResponseDto[];

  constructor(props: GetPermissionsResponseDto) {
    this.data = props.data;
  }
}
