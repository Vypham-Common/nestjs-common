import { Injectable, Scope } from '@nestjs/common';
import { Connection } from 'mongoose';

@Injectable({ scope: Scope.DEFAULT })
export class ConnectionService {
  connections: {
    [k: string]: Connection
  }
  constructor() {
    this.connections = {}
  }

  get(name: string) {
    if (this.connections[name]) {
      return this.connections[name]
    } else {
      return null
    }
  }

  set(name: string, connection: Connection) {
    this.connections[name] = connection

    return this.connections[name]
  }
}
