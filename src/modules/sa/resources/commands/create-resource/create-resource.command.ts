import { Command, CommandProps } from '@libs/ddd';
import { ResourceScopeDto } from './create-resource.request.dto';

export class CreateResourceCommand extends Command {
  readonly name: string;
  readonly displayName: string;
  readonly attributes: { [index: string]: string[] };
  readonly scopes: ResourceScopeDto[];

  constructor(props: CommandProps<CreateResourceCommand>) {
    super(props);
    this.name = props.name;
    this.displayName = props.displayName;
    this.attributes = props.attributes;
    this.scopes = props.scopes;
  }
}
