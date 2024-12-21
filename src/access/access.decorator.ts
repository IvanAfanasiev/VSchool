import { SetMetadata } from '@nestjs/common';
import { AccessEntity } from './entity.acces.enum';

export const Access = (entity: AccessEntity) => SetMetadata('entity', entity);
