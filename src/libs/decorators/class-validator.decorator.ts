import {
  buildMessage,
  IsOptional,
  ValidateBy,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

// default IsOptional allows null values, but in some cases you need to allow undefined values only
export function IsOptionalNonNullable(data?: {
  nullable: boolean;
  validationOptions?: ValidationOptions;
}): PropertyDecorator {
  const { nullable = false, validationOptions = undefined } = data || {};

  if (nullable) {
    // IsOptional allows null
    return IsOptional(validationOptions);
  }

  return ValidateIf((ob: any, v: any) => {
    return v !== undefined;
  }, validationOptions);
}

export function IsDateAfter(
  property: string,
  options?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsDateAfter',
      constraints: [property],
      validator: {
        validate: (value: Date, args: ValidationArguments): boolean => {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ] as Date;

          // if the related value is not set, return false
          if (!value || !relatedValue) return false;

          return value.toISOString() > relatedValue.toISOString();
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            `${each}$property must be after $constraint1`,
          options,
        ),
      },
    },
    options,
  );
}

export function IsBigInt(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isBigInt',
      validator: {
        validate: (value): boolean =>
          (typeof value === 'number' || typeof value === 'string') &&
          (/^[0-9]+$/.test(`${value}`) || /^[0-9]+n+$/.test(`${value}`)),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a BigInt',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
