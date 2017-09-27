'use strict'

import * as assert from 'assert'
import * as http from 'http'
import Client from './Client'

export default class HttpClient implements Client {
  private host: string
  private port: number
  private database: string

  private username: string
  private password: string

  private precision: string
  private timeout: number

  private consistency: string

  constructor(options: any = {}) {
    this.host = options.host || '127.0.0.1'
    this.port = options.port || 8086
    this.database = options.database

    this.username = options.username
    this.password = options.password

        // TODO for now precision will be in nanoseconds
        // assert.ok(['n', 'u', 'ms', 's', 'm', 'h'].indexOf(precision) >= 0, 'Precision must be one of [n,u,ms,s,m,h]')
        // this.precision = options.precision
    this.timeout = options.httpTimeout || 200

    if (options.consistency) {
      assert.ok(['one', 'quorum', 'all', 'any'].indexOf(options.consistency) > -1, 'Consistency must be one of [one,quorum,all,any]')
      this.consistency = options.consistency
    }
  }

  send(buf: Buffer, offset: number, length: number): Promise<void> {
    let qs = '?db=' + this.database
    if (this.username) { qs += '&u=' + this.username }
    if (this.password) { qs += '&p=' + this.password }
    if (this.precision) { qs += '&precision=' + this.precision }
    if (this.consistency) { qs += '&consistency=' + this.consistency }

    return new Promise<void>((resolve, reject) => {
      const params = {
        hostname: this.host,
        port: this.port,
        path: '/write' + qs,
        timeout: this.timeout,
        method: 'POST',
      }
      const req = http.request(params, (res) => {
        switch (res.statusCode) {
          case 204: resolve(); break
          case 200:
          case 401:
          case 400:
          default:
            let data = ''
            res.on('data', (chunk) => { data += chunk })
            res.on('end', () => { reject(new Error(data)) })
            break
        }
      })

      req.on('error', reject)
      req.write(buf.slice(offset, length))
      req.end()
    })
  }

  writePoints(batches: string[][]): Promise<void> {
    return Promise.all(
            batches.map((batch) => {
              const buf = new Buffer(batch.join('\n'))
              return this.send(buf, 0, buf.length)
            })
        ).then(() => { return Promise.resolve() })
  }

}
