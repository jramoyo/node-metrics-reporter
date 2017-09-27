import * as metrics from './metric-types'
import * as report from './report'

export default class Reporter {
  private namespace: string
  private backend: report.Backend
  private report: report.Report

  private reportInterval: any

  /**
   *  @param options: {
   *      reportIntervalTime: <milliseconds>
   *  }
   */
  constructor(namespace: string, backend: report.Backend, report: report.Report, options?: any) {
    this.namespace = namespace
    this.backend = backend
    this.report = report

    if (options.reportIntervalTime) {
      this.reportInterval = this.start(options.reportIntervalTime)
    }
  }

  /**
   * shortcut for counter(name, 1, options)
   */
  incr(name: string, options: any = {}): Promise<void> {
    return this.counter(name, 1, options)
  }

  counter(name: string, val = 1, options: any = {}): Promise<void> {
    return this.applyMetric(name, 'Counter', 'inc', val, options)
  }

  gauge(name: string, val: number, options: any = {}): Promise<void> {
    return this.applyMetric(name, 'Gauge', 'set', val, options)
  }

  histogram(name: string, val: number, options: any = {}): Promise<void> {
    return this.applyMetric(name, 'Histogram', 'update', val, options)
  }

  /**
   * shortcut for meter(name, 1, options)
   */
  mark(name: string, options: any = {}): Promise<void> {
    return this.meter(name, 1, options)
  }

  meter(name: string, val = 1, options: any = {}): Promise<void> {
    return this.applyMetric(name, 'Meter', 'mark', val, options)
  }

  timer(name: string, val: number, options: any = {}): Promise<void> {
    return this.applyMetric(name, 'Timer', 'update', val, options)
  }

  start(reportIntervalTime: number) {
    return setInterval(() => { this.reportMetrics() }, reportIntervalTime)
  }

  stop() {
    if (this.reportInterval) { clearInterval(this.reportInterval) }
  }

  /**
   * options : {
   *     tags = {},
   *     runReport: true
   * }
   */
  private applyMetric(name: string, type: string, func: string, val: any, options: any): Promise<void> {
    const fullname = `${this.namespace}.${name}`
    this.getOrCreateMetric(fullname, type).update(val, options.tags || {})
    return options.runReport !== false ? this.reportMetrics() : Promise.resolve()
  }

  private getOrCreateMetric(name, type: string) {
    return this.report.getMetric(name) || this.initMetric(name, type)
  }

  private initMetric(name: string, type: string): any {
    const metric = new metrics[type]()
    this.report.addMetric(name, metric)
    return metric
  }

  private reportMetrics(): Promise<void> {
    return this.backend.write(this.report)
  }
}
