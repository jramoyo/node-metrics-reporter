import Metric from './Metric'
import ReportMetric from './ReportMetric'

export default class Gauge implements Metric {
  private tags: any
  private val: number

  constructor() {
    this.tags = {}
  }

  update(val: number, tags = {}) {
    this.tags = Object.assign(this.tags, tags)
    this.val = val
  }

  clear() {
    delete this.val
  }

  printObj(): ReportMetric {
    return { type: 'gauge', val: this.val, tags: this.tags } as ReportMetric
  }
}
