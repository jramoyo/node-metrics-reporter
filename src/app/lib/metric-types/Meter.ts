import { Meter as _Meter } from 'metrics'

import Metric from './Metric'
import ReportMetric from './ReportMetric'

export default class Meter implements Metric {
  private meter: any
  private tags: any

  constructor() {
    this.meter = new _Meter()
    this.tags = {}
  }

  update(val = 1, tags = {}) {
    this.tags = Object.assign(this.tags, tags)
    this.meter.mark(val)
  }

  clear() {
    this.meter.clear()
  }

  printObj(): ReportMetric {
    return Object.assign(this.meter.printObj(), { tags: this.tags })
  }
}
