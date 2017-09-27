import * as assert from 'assert'

import * as metricTypes from '../metric-types'
import * as report from '../report'

import Client from './client/Client'
import HttpClient from './client/HttpClient'
import UdpClient from './client/UdpClient'

import InfluxDBCollector from './InfluxDBCollector'

export default class InfluxDB implements report.Backend {
  private client: Client
  private collector: report.Collector

  private batchSize: number
  private points: string[]

  constructor(options: any) {
    const protocol = options.protocol || 'http'
    assert.ok(['udp', 'http'].indexOf(protocol) >= 0, 'Protocol must be one of [udp,http]')

    this.client = protocol === 'udp' ? new UdpClient(options) : new HttpClient(options)
    this.collector = new InfluxDBCollector()

    this.batchSize = options.batchSize || 100
    this.points = []
  }

  write(report: report.Report): Promise<void> {
    const summary = report.summary()
    for (const namespace in summary) {
      for (const name in summary[namespace]) {
        const fullname = `${namespace}.${name}`
        const metric = summary[namespace][name] as metricTypes.ReportMetric
        if (!report.isIdle(fullname, metric)) {
          const tags = report.getTags(metric)
          const fields = this.collector.collect(metric)
          this.addPoint(fullname, tags, fields)
        }
      }
    }

        // TODO buffer
    return this.flush()
  }

  flush(): Promise<void> {
    try {
      const batches = this.createBatches(this.points, this.batchSize)
      return this.client.writePoints(batches)
    } finally {
      this.points = []
    }
  }

  private createBatches(points: string[], size: number) {
    if (points.length < 1) {
      return []
    }
    if (points.length <= size) {
      return [points]
    }
    const batches = []
    let batch
    let c = 0
    let index = 0
    while (true) {
      index = c * size
      batch = points.slice(index, index + size)
      if (batch.length === 0) {
        break
      }
      batches.push(batch)
      c = c + 1
    }
    return batches
  }

  private addPoint(key: string, tags: any, fields: any) {
    this.points.push(this.serialize(key, tags, this.nanotime(), fields))
  }

  private nanotime() {
    return (new Date().getTime() * 1000000)
  }

  private serialize(key: string, tags: any, timestamp: number, fields: any) {
    function escapeMetadata(str: string) {
      return str.replace(/ /g, '\\ ').replace(/,/g, '\\,')
    }

    function escapeString(str: string) {
      return str.replace(/"/g, '\\\"')
    }

    function keySort(a, b) {
      return (a < b) ? -1 : (a > b ? 1 : 0)
    }

    let line = escapeMetadata(key)

    Object.keys(tags).sort(keySort).forEach((key) => {
      line += ',' + escapeMetadata(key) + '=' + escapeMetadata(tags[key])
    })

    let notFirst = false
    Object.keys(fields).sort(keySort).forEach((key) => {
      const value = fields[key]
      if (value.value == null || typeof value.value === 'undefined') {
        return
      }
      let stringValue
      switch (value.type) {
        case 'integer':
          stringValue = value.value.toString() + 'i'
          break
        case 'float':
          stringValue = value.value.toString()
          break
        case 'boolean':
          stringValue = value.value ? 't' : 'f'
          break
        case 'string':
          stringValue = '\"' + escapeString(value.value) + '\"'
          break
        default:
          throw new Error('Unable to serialize value of field "' + key + '"')
      }
      if (notFirst) {
        line += ',' + escapeMetadata(key) + '=' + stringValue
      } else {
        line += ' ' + escapeMetadata(key) + '=' + stringValue
        notFirst = true
      }
    })
    if (timestamp) {
      line += ' ' + timestamp
    }
    return line
  }
}
