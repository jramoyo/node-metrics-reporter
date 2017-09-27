import { Report as _Report } from 'metrics'
import * as metricTypes from '../metric-types'

/**
 * Wrapper for metrics.Report
 */
export default class Report {
  private report: any
  private tags: any
  private previousValues: any

  constructor(tags = {}) {
    this.report = new _Report()
    this.tags = tags
    this.previousValues = {}
  }

  summary() {
    return this.report.summary()
  }

  getMetric(name: string): metricTypes.Metric {
    return this.report.getMetric(name)
  }

  addMetric(name: string, metric: metricTypes.Metric) {
    this.report.addMetric(name, metric)
  }

  getTags(metric: metricTypes.ReportMetric) {
    return Object.assign({}, this.tags, metric.tags)
  }

  isIdle(name: string, metric: metricTypes.ReportMetric) {
    let value
    switch (metric.type) {
      case 'counter':
      case 'histogram':
      case 'meter':
        value = metric['count']
        break
      case 'gauge':
        value = metric['val']
        break
      case 'timer':
        value = metric['rate'].count
    }

    const isIdle = this.delta(name, value) === 0
    if (!isIdle) { this.previousValues[name] = value }
    return isIdle
  }

  private delta(name, value) {
    const previous = this.previousValues[name]
    if (typeof previous === 'undefined') { return -1 }
    return value - previous
  }
}
