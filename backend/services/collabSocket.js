/**
 * BRAHMA Real-Time Collaboration Socket Engine
 * Lightweight WebSocket server for multi-peer code synchronization and room management.
 */
const crypto = require('crypto');

class CollabSocketEngine {
  constructor() {
    this.rooms = new Map(); // roomId -> Set of socket connections
  }

  attach(server) {
    server.on('upgrade', (req, socket, head) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname !== '/ws/collab') {
        socket.destroy();
        return;
      }

      const key = req.headers['sec-websocket-key'];
      if (!key) {
        socket.destroy();
        return;
      }

      // Perform WebSocket Handshake
      const acceptKey = crypto
        .createHash('sha1')
        .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
        .digest('base64');

      const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`
      ];

      socket.write(headers.join('\r\n') + '\r\n\r\n');

      const roomId = url.searchParams.get('room') || 'default-collab';
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      const room = this.rooms.get(roomId);
      room.add(socket);

      console.log(`[Collab Socket] Client connected to room ${roomId} (Total: ${room.size})`);

      socket.on('data', (buffer) => {
        try {
          // Decode simple WS text frame
          const message = this.decodeFrame(buffer);
          if (!message) return;

          // Broadcast to all other peers in the room
          for (const peer of room) {
            if (peer !== socket && peer.writable) {
              this.sendFrame(peer, message);
            }
          }
        } catch (err) {
          console.warn('[Collab Socket Data Error]:', err.message);
        }
      });

      socket.on('close', () => {
        room.delete(socket);
        if (room.size === 0) this.rooms.delete(roomId);
        console.log(`[Collab Socket] Client disconnected from room ${roomId}`);
      });

      socket.on('error', () => {
        room.delete(socket);
      });
    });
  }

  decodeFrame(buffer) {
    if (buffer.length < 2) return null;
    const secondByte = buffer[1];
    const isMasked = (secondByte & 0x80) === 0x80;
    let payloadLen = secondByte & 0x7F;
    let offset = 2;

    if (payloadLen === 126) {
      payloadLen = buffer.readUInt16BE(2);
      offset = 4;
    } else if (payloadLen === 127) {
      return null; // Ignore huge frames for safety
    }

    if (!isMasked) {
      return buffer.slice(offset, offset + payloadLen).toString('utf8');
    }

    const maskKeys = buffer.slice(offset, offset + 4);
    offset += 4;
    const payload = buffer.slice(offset, offset + payloadLen);

    for (let i = 0; i < payload.length; i++) {
      payload[i] ^= maskKeys[i % 4];
    }
    return payload.toString('utf8');
  }

  sendFrame(socket, text) {
    const payload = Buffer.from(text);
    const len = payload.length;
    let header;

    if (len <= 125) {
      header = Buffer.from([0x81, len]);
    } else if (len <= 65535) {
      header = Buffer.alloc(4);
      header[0] = 0x81;
      header[1] = 126;
      header.writeUInt16BE(len, 2);
    } else {
      return;
    }
    socket.write(Buffer.concat([header, payload]));
  }
}

module.exports = new CollabSocketEngine();
