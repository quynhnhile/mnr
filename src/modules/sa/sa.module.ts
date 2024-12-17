import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateRoleService } from './roles/commands/update-role/update-role.service';
import { CreateRoleService } from './roles/commands/create-role/create-role.service';
import { CreateRoleHttpController } from './roles/commands/create-role/create-role.http.controller';
import { UpdateRoleHttpController } from './roles/commands/update-role/update-role.http.controller';
import { DeleteRoleHttpController } from './roles/commands/delete-role/delete-role.http.controller';
import { DeleteRoleService } from './roles/commands/delete-role/delete-role.service';
import { FindRolesHttpController } from './roles/queries/find-roles/find-roles.http.controller';
import { FindRoleQueryHandler } from './roles/queries/find-role/find-role.query-handler';
import { FindRolesQueryHandler } from './roles/queries/find-roles/find-roles.query-handler';
import { FindRoleHttpController } from './roles/queries/find-role/find-role.http.controller';
import { CreateResourceHttpController } from './resources/commands/create-resource/create-resource.http.controller';
import { FindScopesHttpController } from './scopes/queries/find-scopes/find-scopes.http.controller';
import { CreateResourceService } from './resources/commands/create-resource/create-resource.service';
import { FindScopesQueryHandler } from './scopes/queries/find-scopes/find-scopes.query-handler';
import { FindScopeHttpController } from './scopes/queries/find-scope/find-scope.http.controller';
import { FindScopeQueryHandler } from './scopes/queries/find-scope/find-scope.query-handler';
import { UpdateResourceHttpController } from './resources/commands/update-resource/update-resource.http.controller';
import { UpdateResourceService } from './resources/commands/update-resource/update-resource.service';
import { DeleteResourceHttpController } from './resources/commands/delete-resource/delete-resource.http.controller';
import { DeleteResourceService } from './resources/commands/delete-resource/delete-resource.service';
import { FindResourcesHttpController } from './resources/queries/find-resources/find-resources.http.controller';
import { FindResourcesQueryHandler } from './resources/queries/find-resources/find-resources.query-handler';
import { FindResourceHttpController } from './resources/queries/find-resource/find-resource.http.controller';
import { FindResourceQueryHandler } from './resources/queries/find-resource/find-resource.query-handler';
import { CreateUserHttpController } from './users/commands/create-user/create-user.http.controller';
import { CreateUserService } from './users/commands/create-user/create-user.service';
import { UpdateProfileUserHttpController } from './users/commands/update-profile-user/update-profile-user.http.controller';
import { UpdateProfileUserService } from './users/commands/update-profile-user/update-profile-user.service';
import { DeleteUserService } from './users/commands/delete-user/delete-user.service';
import { DeleteUserHttpController } from './users/commands/delete-user/delete-user.http.controller';
import { FindUserHttpController } from './users/queries/find-user/find-user.http.controller';
import { FindUserQueryHandler } from './users/queries/find-user/find-user.query-handler';
import { FindUsersHttpController } from './users/queries/find-users/find-users.http.controller';
import { FindUsersQueryHandler } from './users/queries/find-users/find-users.query-handler';
import { UpdateRolePermissionsController } from './permissions/commands/update-role-permissions/update-role-permissions.controller';
import { UpdateRolePermissionsService } from './permissions/commands/update-role-permissions/update-role-permissions.service';
import { GetListRoleWithPermissionsController } from './permissions/queries/get-list-role-with-permissions.controller';
import { GetListRoleWithPermissionsQueryHandler } from './permissions/queries/get-list-role-with-permissions.query-handler';
import { UpdatePasswordUserService } from './users/commands/update-password-user/update-password-user.service';
import { UpdatePasswordUserHttpController } from './users/commands/update-password-user/update-password-user.http.controller';
import { FindUsersInRoleHttpController } from './roles/queries/find-users-in-role/find-users-in-role.http.controller';
import { FindUsersInRoleQueryHandler } from './roles/queries/find-users-in-role/find-users-in-role.query-handler';

const httpControllers = [
  // role
  CreateRoleHttpController,
  UpdateRoleHttpController,
  DeleteRoleHttpController,
  FindRolesHttpController,
  FindRoleHttpController,
  FindUsersInRoleHttpController,

  // resource
  CreateResourceHttpController,
  UpdateResourceHttpController,
  DeleteResourceHttpController,
  FindResourcesHttpController,
  FindResourceHttpController,

  // scope
  FindScopeHttpController,
  FindScopesHttpController,

  // user
  CreateUserHttpController,
  UpdateProfileUserHttpController,
  UpdatePasswordUserHttpController,
  DeleteUserHttpController,
  FindUserHttpController,
  FindUsersHttpController,

  // permission
  UpdateRolePermissionsController,
  GetListRoleWithPermissionsController,
];

const cliControllers: Provider[] = [];

const messageControllers = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  // role
  CreateRoleService,
  UpdateRoleService,
  DeleteRoleService,

  // resource
  CreateResourceService,
  UpdateResourceService,
  DeleteResourceService,

  // user
  CreateUserService,
  UpdateProfileUserService,
  UpdatePasswordUserService,
  DeleteUserService,

  // permission
  UpdateRolePermissionsService,
];

const queryHandlers: Provider[] = [
  // role
  FindRoleQueryHandler,
  FindRolesQueryHandler,
  FindUsersInRoleQueryHandler,

  // resource
  FindResourcesQueryHandler,
  FindResourceQueryHandler,

  // scope
  FindScopeQueryHandler,
  FindScopesQueryHandler,

  // user
  FindUserQueryHandler,
  FindUsersQueryHandler,

  // permission
  GetListRoleWithPermissionsQueryHandler,
];

const repositories: Provider[] = [];

const mappers: Provider[] = [];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...repositories,
    ...queryHandlers,
    ...commandHandlers,
    ...graphqlResolvers,
    ...mappers,
    ...cliControllers,
  ],
  exports: [...repositories],
})
export class SaModule {}
