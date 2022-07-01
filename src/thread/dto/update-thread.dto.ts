import { PartialType } from '@nestjs/mapped-types';
import { CreateThreadRquestDto } from './create-thread.dto';

export class UpdateThreadDto extends PartialType(CreateThreadRquestDto) {}
