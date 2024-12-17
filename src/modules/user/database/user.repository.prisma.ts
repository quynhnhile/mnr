// import { PrismaRepositoryBase } from '@libs/db/prisma-repository.base';
// import { PrismaService } from '@libs/prisma/prisma.service';
// import { Injectable } from '@nestjs/common';
// import { User as UserModel } from '@prisma/client';
// import { UserEntity } from '../domain/user.entity';
// import { PrismaUserMapper } from '../prisma-user.mapper';
// import { UserRepositoryPort } from './user.repository.port';

// @Injectable()
// export class PrismaUserRepository
//   extends PrismaRepositoryBase<UserEntity, UserModel>
//   implements UserRepositoryPort
// {
//   protected modelName = 'user';

//   constructor(private prisma: PrismaService, mapper: PrismaUserMapper) {
//     super(prisma, mapper);
//   }

//   async updateAddress(user: UserEntity): Promise<void> {
//     const address = user.getProps().address;
//     await this.prisma.user.update({
//       where: { id: user.id },
//       data: {
//         street: address.street,
//         country: address.country,
//         postalCode: address.postalCode,
//       },
//     });
//   }

//   async findOneByEmail(email: string): Promise<UserEntity | null> {
//     const user = await this.prisma.user.findFirst({ where: { email } });
//     return user ? this.mapper.toDomain(user) : null;
//   }
// }
