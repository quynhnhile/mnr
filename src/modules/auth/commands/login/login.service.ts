import { Ok, Result } from 'oxide.ts';
import { InvalidTokenError } from '@modules/auth/domain/auth.error';
import { LoginResponseDto } from '@modules/auth/dtos/login.response.dto';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { FindAllRegionsQuery } from '@src/modules/region/queries/find-all-regions/find-all-regions.query-handler';
import { FindAllTerminalsQuery } from '@src/modules/terminal/queries/find-all-terminals/find-all-terminals.query-handler';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginService implements ICommandHandler {
  constructor(private readonly queryBus: QueryBus) {}
  async execute(
    command: LoginCommand,
  ): Promise<Result<LoginResponseDto, InvalidTokenError>> {
    try {
      console.log(command.terminals);
      const terminalsResult = await this.queryBus.execute(
        new FindAllTerminalsQuery({
          where: {
            terminalCode: {
              in: command.terminals,
            },
          },
        }),
      );
      const terminals = terminalsResult.unwrap();

      const regionsResult = await this.queryBus.execute(
        new FindAllRegionsQuery({
          where: {
            regionCode: {
              in: terminals.map((r) => r.regionCode),
            },
          },
          orderBy: [{ sort: 'asc' }],
        }),
      );
      const regions = regionsResult.unwrap();
      console.log(regions);
      const user: LoginResponseDto = {
        id: command.id,
        email: command.email,
        firstName: command.firstName,
        lastName: command.lastName,
        permissions: command.permissions.map((permission) => ({
          rsname: permission.rsname,
          rsid: permission.rsid,
          scopes: permission.scopes,
        })),
        regions: regions.map((r) => {
          const regionProps = r.getProps();
          return {
            id: regionProps.id.toString(),
            regionCode: regionProps.regionCode,
            regionName: regionProps.regionName,
            teminals: terminals
              .filter((t) => t.regionCode === r.regionCode)
              .map((t) => {
                const terminalProps = t.getProps();
                return {
                  id: terminalProps.id.toString(),
                  terminalCode: terminalProps.terminalCode,
                  terminalName: terminalProps.terminalName,
                  terminalNameEng: terminalProps.terminalNameEng,
                };
              }),
          };
        }),
      };
      return Ok(user);
    } catch (error) {
      throw error;
    }
  }
}
