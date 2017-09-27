import ReportMetric from './ReportMetric'

interface Metric {
  update(val: number, tags: any)
  clear(): void
  printObj(): ReportMetric
}

export default Metric
