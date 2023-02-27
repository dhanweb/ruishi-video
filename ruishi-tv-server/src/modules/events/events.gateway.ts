import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
const l = console.log;

@WebSocketGateway(4000)
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('events')
  onEvent(client: any, payload: any): any {
    // this.server.emit('resmsg', data);  // io.emit('resmsg', payload)
    const { name } = payload;
    if (name === 'ajanuw') {
      return of({
        event: 'events',
        data: {
          msg: 'hello ajanuw!',
        },
      });
    }
    if (name === 'alone') {
      return of('hi', '实打实').pipe(
        map(($_) => ({
          event: 'events',
          data: {
            msg: $_,
          },
        })),
      );
    }
    return of(payload);
  }
}
