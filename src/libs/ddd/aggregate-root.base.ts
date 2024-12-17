import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from './domain-event.base';
import { Entity, EntityID } from './entity.base';

export abstract class AggregateRoot<
  EntityProps,
  A extends EntityID,
> extends Entity<EntityProps, A> {
  private _domainEvents: DomainEvent<A>[] = [];

  get domainEvents(): DomainEvent<A>[] {
    return this._domainEvents;
  }

  addEvent(domainEvent: DomainEvent<A>): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public async publishEvents(eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        // logger.debug(
        //   `[${RequestContextService.getRequestId()}] "${
        //     event.constructor.name
        //   }" event published for aggregate ${this.constructor.name} : ${
        //     this.id
        //   }`,
        // );

        return eventEmitter.emitAsync(event.constructor.name, event);
      }),
    );
    this.clearEvents();
  }
}
