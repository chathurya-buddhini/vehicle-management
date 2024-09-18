

// Import necessary decorators and classes from the '@nestjs/websockets' package.
import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';

import { Server } from 'socket.io';


@WebSocketGateway()
export class BatchGateway implements OnGatewayInit {
  
  @WebSocketServer()
  server: Server; // This 'server' variable will store the Socket.IO server instance.

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  notifyBatchComplete(message: string) {
    // Emit a 'batchComplete' event to all connected WebSocket clients, sending a message with it.
    this.server.emit('batchComplete', { message });
  }
}
