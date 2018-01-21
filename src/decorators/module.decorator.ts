import 'reflect-metadata';
import { IModule } from './../interfaces';

export const Module = (filter: IModule): ClassDecorator => {
  return (target: Object) => {
    Reflect.defineMetadata('isModule', true, target);
    for (const property in filter) {
      if (filter.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, filter[property], target);
      }
    }
  };
};
