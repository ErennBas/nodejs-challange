/* eslint-disable */
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthService } from 'src/auth/service/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.model';
import { ChatMessage } from './entities/chat.model';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  server: Server;

  constructor(private readonly chatService: ChatService, private authService: AuthService, private userService: UsersService) { }

  async handleConnection(socket: Socket) {
    try {
      console.log("NEW CONNECTION");
      const token = await this.authService.verifytoken(socket.handshake.headers.authorization);
      const user: User = await this.userService.findOne(token.data.id);
      if (user) {
        const messages = await this.chatService.getMessages({ limit: 20, page: 1 });
        socket.data.user = user;
        await this.server.to(socket.id).emit('messages', messages);
        await this.server.to('room1').emit('connection', socket.data.user);
        socket.join('room1');
        /*
        
        Eğer yetiştirebilseydim bir arkadaşlık sistemi kuracaktım. ve bu satırda bir odadaki herkese atmaktansa bağlanan lkişinin sadece arkadaşlarına atıcaktım

        const friends = await getFriends();
        for(let user of friends){
          await this.server.to(user.socketId).emit('newConnection', user)
        }
        
        */
      }
      else {
        return this.disconnect(socket);
      }
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    this.server.to('room1').emit('disconnect', socket.data.user);
    /*
        
        Eğer yetiştirebilseydim bir arkadaşlık sistemi kuracaktım. ve bu satırda bir odadaki herkese atmaktansa bağlanan lkişinin sadece arkadaşlarına atıcaktım

        const friends = await getFriends();
        for(let user of friends){
          await this.server.to(user.socketId).emit('newDisconnect', user)
        }
        
        */
    socket.disconnect();
  }


  async disconnect(socket: Socket) {
    this.server.to('room1').emit('disconnect', socket.data.user);
    /*
        
        Eğer yetiştirebilseydim bir arkadaşlık sistemi kuracaktım. ve bu satırda bir odadaki herkese atmaktansa bağlanan lkişinin sadece arkadaşlarına atıcaktım

        const friends = await getFriends();
        for(let user of friends){
          await this.server.to(user.socketId).emit('newDisconnect', user)
        }
        
        */
    socket.disconnect();
  }

  @SubscribeMessage('sendMsg')
  async sendMessage(socket: Socket, message: ChatMessage) {
    await this.chatService.create(message);
    await this.server.to('room1').emit('newMessage', { msg: message, user: socket.data.user })
    /*
        
        Eğer yetiştirebilseydim bir arkadaşlık sistemi kuracaktım. ve bu satırda bir odadaki herkese atmaktansa bağlanan lkişinin sadece arkadaşlarına atıcaktım

        const friends = await getFriends();
        for(let user of friends){
          await this.server.to(user.socketId).emit('newMessage', user)
        }

        Ya da şöyle bir senaryo da olabilirdi; bir kullanıcının sabit bir odası oluardu. Arkadaşlık kurduğu diğer kullanıcılar bu odaya join olurlardı ve ben sadece 
        server.to('userRoomId').emit('msg', msg) şeklinde yapabilirdim. Fakat burada hangisi daha iyi bir yol bilemedim. Test için yeterli zamanım ve deneyimim yoktu.
        
        */
  }

  @SubscribeMessage('oldMgs')
  async getOldMessage(socket: Socket, page: any){
    const messages = await this.chatService.getMessages(page);
    this.server.to(socket.id).emit('oldMsg', messages);
  }
}
