import { Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { AgentCodeAlreadyExistsError } from './agent.error';
import { CreateAgentProps, AgentProps, UpdateAgentProps } from './agent.type';

export class AgentEntity extends AggregateRoot<AgentProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateAgentProps): AgentEntity {
    return new AgentEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateAgentProps,
  ): Result<unknown, AgentCodeAlreadyExistsError> {
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, AgentCodeAlreadyExistsError> {
    // Entity business rules validation
    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
