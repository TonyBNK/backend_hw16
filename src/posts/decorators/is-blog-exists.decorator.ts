import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { BlogsQueryRepository } from '../../blogs/blogs.query-repository';

@ValidatorConstraint({ name: 'IsBlogExists', async: true })
@Injectable()
export class IsBlogExistsConstraint implements ValidatorConstraintInterface {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

  async validate(blogId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    return Boolean(blog);
  }

  defaultMessage(): string {
    return 'Such blog does not exist.';
  }
}

export function IsBlogExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogExistsConstraint,
    });
  };
}
