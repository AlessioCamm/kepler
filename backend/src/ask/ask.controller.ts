import { Body, Controller, Post } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskDto } from './dto/ask.dto';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post()
  async ask(@Body() dto: AskDto): Promise<{ reply: string }> {
    const reply = await this.askService.ask(dto.message);
    return { reply };
  }
}
