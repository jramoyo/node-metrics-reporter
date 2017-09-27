import * as sinon from 'sinon'
import { expect } from 'chai'
import 'sinon-chai'

import * as index from '#index'

describe('#metrics-reporter', () => {

  let metrics

  beforeEach(() => {

    metrics = index.createMetrics({
      namespace: 'test',
      influxdb: {
        host: process.env.INFLUXDB_HOST,
        port: process.env.INFLUXDB_PORT,
        database: 'app_metrics'
      }
    })

  })

  describe('#counter', () => {
    it('reports a counter to influxdb', () => {
      return metrics.counter('counter', 1, { tags: { scope: 'integration' } })
    })
  })

  describe('#gauge', () => {
    it('reports a gauge to influxdb', () => {
      return metrics.gauge('gauge', 1, { tags: { scope: 'integration' } })
    })
  })

  describe('#histogram', () => {
    it('reports a histogram to influxdb', () => {
      return metrics.histogram('histogram', 1, { tags: { scope: 'integration' } })
    })
  })

  describe('#meter', () => {
    it('reports a meter to influxdb', () => {
      return metrics.meter('meter', 1, { tags: { scope: 'integration' } })
    })
  })

  describe('#timer', () => {
    it('reports a timer to influxdb', () => {
      return metrics.timer('timer', 1, { tags: { scope: 'integration' } })
    })
  })
})
