import { Module } from '@nestjs/common';
import { GatewayChat } from './gateway.chat';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule], 
  providers: [GatewayChat],
})
export class GatewayModule {}