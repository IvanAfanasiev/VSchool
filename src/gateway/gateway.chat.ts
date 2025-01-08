import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';

@WebSocketGateway({ cors: true })
@UseGuards(AuthGuard)
export class GatewayChat {
  @WebSocketServer()
  server: Server;

  sendMessageToClients(message: any) {
    this.server.emit('newMessage', message);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: any, payload: any) {
    this.sendMessageToClients(payload); 
  }

  @SubscribeMessage('typing')
  TypingMessage(chatId: any, isTyping: boolean) {
    console.log(isTyping); 
  }

}