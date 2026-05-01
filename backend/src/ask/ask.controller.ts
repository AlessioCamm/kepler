import { Body, Controller, MessageEvent, Post, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
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

  @Sse('stream')
  stream(@Query('message') message: string): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      (async () => {
        try {
          for await (const chunk of this.askService.askStream(message)) {
            subscriber.next({ data: chunk });
          }
          subscriber.complete();
        } catch (err) {
          subscriber.error(err);
        }
      })();
    });
  }
}
