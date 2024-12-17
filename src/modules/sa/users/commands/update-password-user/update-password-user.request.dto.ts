import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';
import CredentialRepresentation from '@src/libs/keycloak/defs/credential-representation';

export class UpdatePasswordUserRequestDto {
  @ApiPropertyOptional({
    example: [{ value: '' }],
    description: 'THÔNG TIN XÁC THỰC',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsArray()
  credentials: CredentialRepresentation[];
}
