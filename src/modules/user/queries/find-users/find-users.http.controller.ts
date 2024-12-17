import { Result } from 'oxide.ts';
import { routesV1 } from '@config/app.routes';
import { ResponseBase } from '@libs/api/response.base';
import { Paginated } from '@libs/ddd';
import { UserEntity } from '@modules/user/domain/user.entity';
import { UserPaginatedResponseDto } from '@modules/user/dtos/user.paginated.response.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindUsersQuery } from './find-users.query-handler';
import { FindUsersRequestDto } from './find-users.request.dto';

@Controller(routesV1.version)
export class FindUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.user.root)
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  async findUsers(
    @Query() queryParams: FindUsersRequestDto,
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery(queryParams);
    const result: Result<
      Paginated<UserEntity>,
      Error
    > = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    // Whitelisting returned properties
    return new UserPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((user) => {
        const { email, address, ...rest } = user.getProps();
        return {
          ...new ResponseBase(rest),
          email,
          country: address.country,
          postalCode: address.postalCode,
          street: address.street,
        };
      }),
    });
  }
}
