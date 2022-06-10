import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello(): string {
    return 'Hello!';
  }
}
