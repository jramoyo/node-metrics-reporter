import * as report from './lib/report'
import InfluxDB from './lib/influxdb/InfluxDB'
import Reporter from './lib/Reporter'

// Only supports InfluxDB for now
const createBackend = (options: any): report.Backend => {
  let backend: InfluxDB

  if (options) {
    backend = new InfluxDB(options)
  } else {  // Mock
    backend = new InfluxDB({})
    backend.flush = () => { return Promise.resolve() } // Clobber the flush method and nothing goes to influx
  }

  return backend
}

const createReport = (options: any): report.Report => {
  return new report.Report(options)
}

export const createMetrics = (options: any = {}) => {
  return new Reporter(
        options.namespace,
        createBackend(options.influxdb),
        createReport(options.tags),
        options
    )
}
