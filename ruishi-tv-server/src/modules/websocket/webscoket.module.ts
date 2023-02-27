import { WsStartGateway } from './websocket.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [WsStartGateway],
})
export class RSTVWebSocketModule {}
