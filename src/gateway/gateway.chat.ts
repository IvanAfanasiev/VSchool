import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/jwt.constants';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class GatewayChat implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  private server: Server;
  
  
  private connectedUsers = new Map<string, string>();

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        console.error('No token provided');
        client.disconnect();
        return;
      }

      const payload: any = jwt.verify(token, jwtConstants.secret);
      const userId = payload.id;

      if (!userId) {
        console.error('Invalid token payload');
        client.disconnect();
        return;
      }

      this.connectedUsers.set(client.id, userId);
      // console.log(`User connected: ${userId}`);
    } catch (err) {
      console.error('Error verifying token:', err.message);
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    // const userId = this.connectedUsers.get(client.id);
    // console.log(`User disconnected: ${userId}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('testSocket')
  test(client: Socket, payload: any, @MessageBody('chatId') chatId: number): string {
    console.log(`data received: ${chatId}`);
    return 'data received!';
  }
  
  
  
  private broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
  
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { chatId: number }) {
    const room = payload.chatId.toString();
    client.join(room);
    // console.log(`Client ${client.id} joined room ${room}`);
  }
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: { chatId: number }) {
    const room = payload.chatId.toString();
    client.leave(room);
    // console.log(`Client ${client.id} left room ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any) {
    const userId = this.connectedUsers.get(client.id);
    // console.log(`User ${userId} sent a message:`, payload);
    if (userId) {
      const messageData = {
        chatId: payload.chatId,
        message: payload.message,
      };
      this.server.to(payload.chatId).emit('newMessage', messageData);
    }
  }

  @SubscribeMessage('typing')
  async handleTypingMessage(client: Socket, payload: any) {
    const userId = this.connectedUsers.get(client.id);
    // console.log(`User ${userId} is typing(${payload.isTyping}) in chat ${payload.chatId}`);
    if (userId) {
      const typingData = {
        chatId: payload.chatId,
        isTyping: payload.isTyping,
        username: await this.userService.getName(+userId),
      };
      client.to(payload.chatId.toString()).emit('newTyping', typingData);
    }
  }
}
