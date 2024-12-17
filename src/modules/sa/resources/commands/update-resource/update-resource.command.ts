import { Command, CommandProps } from '@libs/ddd';
import { ResourceScopeDto } from '../create-resource/create-resource.request.dto';

export class UpdateResourceCommand extends Command {
  readonly resourceId: string;
  readonly name?: string;
  readonly displayName?: string;
  readonly attributes?: { [index: string]: string[] };
  readonly scopes: ResourceScopeDto[];

  constructor(props: CommandProps<UpdateResourceCommand>) {
    super(props);
    this.resourceId = props.resourceId;
    this.name = props.name;
    this.displayName = props.displayName;
    this.attributes = props.attributes;
    this.scopes = props.scopes;
  }
}
