import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { isEmail } from 'class-validator';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isEmail(value)) {
      throw new BadRequestException('Invalid email');
    }

    return value;
  }
}
