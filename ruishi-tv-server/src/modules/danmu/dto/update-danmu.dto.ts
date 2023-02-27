import { PartialType } from '@nestjs/mapped-types';
import { CreateDanmuDto } from './create-danmu.dto';

export class UpdateDanmuDto extends PartialType(CreateDanmuDto) {}
