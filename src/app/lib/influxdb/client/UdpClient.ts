'use strict'

import * as dns from 'dns'
import * as dgram from 'dgram'
import Client from './Client'

export default class UdpClient implements Client {
  private host: string
  private port: number
  private maxPacketSize: number

  constructor(options: any = {}) {
    this.host = options.host || '127.0.0.1'
    this.port = options.port || 8089
    this.maxPacketSize = options.maxPacketSize || 1024
  }

  send(buf: Buffer, offset: number, length: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      dns.lookup(this.host, (err, address, family) => {
        if (err) { reject(err); return }
        const socket = dgram.createSocket(family === 4 ? 'udp4' : 'udp6')
        socket.send(buf, offset, length, this.port, address, (err) => {
          if (err) { reject(err); return }
          socket.close()
          resolve()
        })
      })
    })
  }

  writePoints(batches: string[][]): Promise<void> {
    const packets = []
    for (let i = 0; i < batches.length; i = i + 1) {
      const batch = batches[i]
      let buf = new Buffer(batch[0])
      for (let l = 1; l < batch.length; l = l + 1) {
        const line = batch[l]
        const str = '\n' + line
        if (buf.length + Buffer.byteLength(str) <= this.maxPacketSize) {
          buf = Buffer.concat([buf, new Buffer(str)])
        } else {
          packets.push(buf)
          buf = new Buffer(line)
        }
      }
      packets.push(buf)
    }

    return Promise.all(
      packets.map((packet) => {
        return this.send(packet, 0, packet.length)
      })
    ).then(() => { return Promise.resolve() })
  }
}
