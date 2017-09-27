import { Counter as _Counter } from 'metrics'

import Metric from './Metric'
import ReportMetric from './ReportMetric'

export default class Counter implements Metric {
  private counter: any
  private tags: any

  constructor() {
    this.counter = new _Counter()
    this.tags = {}
  }

  update(val = 1, tags = {}) {
    this.tags = Object.assign(this.tags, tags)
    this.counter.inc(val)
  }

  clear() {
    this.counter.clear()
  }

  printObj(): ReportMetric {
    return Object.assign(this.counter.printObj(), { tags: this.tags })
  }
}
