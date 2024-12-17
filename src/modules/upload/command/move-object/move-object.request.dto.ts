import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength } from 'class-validator';
export type infor = {
  oldPath: string;
  newCom?: string;
  newLoc?: string;
  newDam?: string;
  newRep?: string;
  newLength?: string;
  newWidth?: string;
  newQuantity?: string;
};
export class MoveObjectRequestDto {
  @ApiProperty({
    example: [
      {
        // từ detail này chuyển sang detail khác
        oldPath:
          'TEMU8121621_CONT123456/getin/survey_0/HWR.TX7N.DT.RP.150.100.2/TEMU8121621_1.jpg',
        newCom: 'HWR',
        newLoc: 'TX7N',
        newDam: 'DT',
        newRep: 'RP',
        newLength: '150',
        newWidth: '100',
        newQuantity: '2',
      },
      {
        // từ all chuyển sang detail
        oldPath: 'TEMU8121621_CONT1234567/getin/survey_0/all/TEMU8121621_2.jpg',
        newCom: 'HWR',
        newLoc: 'TX7N',
        newDam: 'DT',
        newRep: 'RP',
        newLength: '150',
        newWidth: '100',
        newQuantity: '2',
      },
    ],
    description: 'Thông tin thay đổi',
    type: 'string',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  information: infor[];

  @ApiProperty({
    example: 'detail',
    enum: ['all', 'detail'],
    description: `MẶT`,
  })
  @IsNotEmpty()
  @MaxLength(50)
  newSide: string;
}

// import { ApiProperty } from '@nestjs/swagger';
// import { Transform } from 'class-transformer';
// import { IsArray, IsNotEmpty, MaxLength } from 'class-validator';
// export type infor = {
//   oldPath: string;
//   newCom?: string;
//   newLoc?: string;
//   newRep?: string;
// };
// export class MoveObjectRequestDto {
//   @ApiProperty({
//     example: [
//       {
//         oldPath:
//           'TEMU8121621_CONT1234567/getin/survey_0/all/TEMU8121621_1_all.jpg',
//         newCom: 'HWR',
//         newLoc: 'TX7N',
//         newRep: 'RP',
//       },
//       {
//         oldPath:
//           'TEMU8121621_CONT1234567/getin/survey_0/all/TEMU8121621_2_all.jpg',
//         newCom: 'HWR',
//         newLoc: 'TX7N',
//         newRep: 'RP',
//       },
//     ],
//     description: 'Thông tin thay đổi',
//     type: 'string',
//     isArray: true,
//   })
//   @IsNotEmpty()
//   @IsArray()
//   @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
//   information: infor[];

//   @ApiProperty({
//     example: 'in',
//     enum: ['all', 'in', 'out'],
//     description: `MẶT`,
//   })
//   @IsNotEmpty()
//   @MaxLength(50)
//   newSide: string;
// }
