import { Timer as _Timer } from 'metrics'

import Metric from './Metric'
import ReportMetric from './ReportMetric'

export default class Timer implements Metric {
  private timer: any
  private tags: any

  constructor() {
    this.timer = new _Timer()
    this.tags = {}
  }

  update(val: number, tags = {}) {
    this.tags = Object.assign(this.tags, tags)
    this.timer.update(val)
  }

  clear() {
    this.timer.clear()
  }

  printObj(): ReportMetric {
    return Object.assign(this.timer.printObj(), { tags: this.tags })
  }
}
