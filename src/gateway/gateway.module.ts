import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { MessageService } from 'src/message/message.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  providers: [AppGateway, MessageService],
})
export class GatewayModule {}