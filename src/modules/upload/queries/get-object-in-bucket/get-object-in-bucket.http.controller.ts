import { routesV1 } from '@config/app.routes';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetObjectInBucketResponseDto } from './get-object-in-bucket.response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KeycloakAuthGuard } from '@src/modules/auth/guards';
import { resourcesV1 } from '@src/configs/app.permission';
import {
  GetObjectInBucketQuery,
  GetObjectInBucketService,
} from './get-object-in-bucket.service';

@Controller(routesV1.version)
export class GetObjectInBucketHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly getObjectInBucketService: GetObjectInBucketService,
  ) {}
  @ApiOperation({ summary: 'Get Object In bucket' })
  @ApiQuery({
    name: 'containerNo',
    description: 'Số container',
    type: 'string',
    required: true,
    example: 'CONT123456',
  })
  @ApiQuery({
    name: 'idCont',
    description: 'Id container',
    type: 'string',
    required: false,
    example: '1',
  })
  @ApiQuery({
    name: 'jobTask',
    description: 'Tác nghiệp (getin | getout)',
    type: 'string',
    required: false,
    example: 'getin',
  })
  @ApiQuery({
    name: 'surveyType',
    description: 'Loại phát hiện (survey | repair | clean | PTI | araise)',
    type: 'string',
    required: false,
    example: 'survey',
  })
  @ApiQuery({
    name: 'seq',
    description: 'Số lần',
    type: 'string',
    required: false,
    example: '0',
  })
  @ApiQuery({
    name: 'side',
    description: 'Mặt (all | detail)',
    type: 'string',
    required: false,
    example: 'all',
  })
  @ApiQuery({
    name: 'com',
    description: 'Mã com',
    type: 'string',
    required: false,
    example: 'HWR',
  })
  @ApiQuery({
    name: 'loc',
    description: 'Mã loc',
    type: 'string',
    required: false,
    example: 'TX7N',
  })
  @ApiQuery({
    name: 'dam',
    description: 'Mã dam',
    type: 'string',
    required: false,
    example: 'DT',
  })
  @ApiQuery({
    name: 'rep',
    description: 'Mã rep',
    type: 'string',
    required: false,
    example: 'RP',
  })
  @ApiQuery({
    name: 'length',
    description: 'Length',
    type: 'string',
    required: false,
    example: '150',
  })
  @ApiQuery({
    name: 'width',
    description: 'Width',
    type: 'string',
    required: false,
    example: '100',
  })
  @ApiQuery({
    name: 'quantity',
    description: 'Quantity',
    type: 'string',
    required: false,
    example: '2',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetObjectInBucketResponseDto,
  })
  @ApiTags(`${resourcesV1.UPLOAD.parent} - ${resourcesV1.UPLOAD.displayName}`)
  @UseGuards(KeycloakAuthGuard)
  @Get(routesV1.upload.getObject)
  async GetObjectInBucket(
    @Query()
    queryParam: {
      containerNo: string;
      idCont?: string;
      jobTask?: string;
      surveyType?: string;
      seq?: string;
      side?: string;
      com?: string;
      loc?: string;
      dam?: string;
      rep?: string;
      length?: string;
      width?: string;
      quantity?: string;
    },
  ): Promise<GetObjectInBucketResponseDto[]> {
    const query = new GetObjectInBucketQuery(
      queryParam.containerNo,
      queryParam.idCont || '',
      queryParam.jobTask || '',
      queryParam.surveyType || '',
      queryParam.seq || '',
      queryParam.side || '',
      queryParam.com || '',
      queryParam.loc || '',
      queryParam.dam || '',
      queryParam.rep || '',
      queryParam.length || '',
      queryParam.width || '',
      queryParam.quantity || '',
    );
    const result = await this.getObjectInBucketService.execute(query);
    return result;
  }
}
