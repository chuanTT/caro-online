import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function StartDateBeforeEndDate(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: StartDateBeforeEndDateConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'StartDateBeforeEndDate' })
export class StartDateBeforeEndDateConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments) {
    const object = args.object as any;
    const startDate = object.startDate;
    const endDate = object.endDate;

    // Nếu không có ngày bắt đầu hoặc ngày kết thúc, không kiểm tra
    if (!startDate || !endDate) {
      return true; // Không kiểm tra nếu không có cả hai
    }

    return startDate < endDate; // Kiểm tra ngày
  }
}
