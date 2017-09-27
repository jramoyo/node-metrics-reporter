import * as metricTypes from '../metric-types'

interface Collector {
  collect(metric: metricTypes.ReportMetric)
}

export default Collector
