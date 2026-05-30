import { Body, Controller, MessageEvent, Post, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AskService } from './ask.service';
import { AskDto, ChatMessageDto } from './dto/ask.dto';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post()
  async ask(@Body() dto: AskDto): Promise<{ reply: string }> {
    const reply = await this.askService.ask(dto.messages);
    return { reply };
  }

  @Sse('stream')
  stream(@Query('messages') messagesJson: string): Observable<MessageEvent> {
    const messages: ChatMessageDto[] = JSON.parse(messagesJson);
    return new Observable((subscriber) => {
      (async () => {
        try {
          for await (const chunk of this.askService.askStream(messages)) {
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
