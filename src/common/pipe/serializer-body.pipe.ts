import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class SerializerBody implements PipeTransform {
  constructor(private group?: string[]) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    const object = plainToInstance(metatype, value, { groups: this.group });
    const errors = await validate(object, {
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    });
    if (errors.length > 0) {
      throw new BadRequestException(
        errors
          .map((e) => {
            const collect = [];
            for (const key in e.constraints) {
              collect.push(e.constraints[key]);
            }
            return collect;
          })
          .flat(),
      );
    }
    return plainToClass(metatype, value, { groups: this.group });
  }
}
