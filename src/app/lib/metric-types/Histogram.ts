import { Histogram as _Histogram } from 'metrics'

import Metric from './Metric'
import ReportMetric from './ReportMetric'

export default class Histogram implements Metric {
  private histogram: any
  private tags: any

  constructor() {
    this.histogram = new _Histogram()
    this.tags = {}
  }

  update(val: number, tags = {}) {
    this.tags = Object.assign(this.tags, tags)
    this.histogram.update(val)
  }

  clear() {
    this.histogram.clear()
  }

  printObj(): ReportMetric {
    return Object.assign(this.histogram.printObj(), { tags: this.tags })
  }
}
