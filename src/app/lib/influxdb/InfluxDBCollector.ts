import * as _ from 'lodash'

import * as metricTypes from '../metric-types'
import * as report from '../report'

function sanitise(obj) {
  return _.mapValues(obj, (value) => {
    if (typeof value === 'object') {
      return sanitise(value)
    }
    if (typeof value === 'string' || (isFinite(value) && !isNaN(value))) {
      return value
    } else { return 0 }
  })
}

export default class InfluxDBCollector implements report.Collector {

  collect(metric: metricTypes.ReportMetric) {
    let fields
    switch (metric.type) {
      case 'counter': fields = this.counter(metric); break
      case 'gauge': fields = this.gauge(metric); break
      case 'histogram': fields = this.histogram(metric); break
      case 'meter': fields = this.meter(metric); break
      case 'timer': fields = this.timer(metric); break
    }
    return sanitise(fields)
  }

  private counter(metric: any) {
    const fields = {}
    fields['count'] = { type: 'integer', value: metric.count }

    return fields
  }

  private gauge(metric: any) {
    const fields = {}
    fields['value'] = { type: 'integer', value: metric.val }

    return fields
  }

  private meter(metric: any) {
    const fields = {}
    fields['count'] = { type: 'integer', value: metric.count }
    fields['one-minute'] = { type: 'float', value: metric.m1 }
    fields['five-minute'] = { type: 'float', value: metric.m5 }
    fields['fifteen-minute'] = { type: 'float', value: metric.m15 }
    fields['mean-rate'] = { type: 'float', value: metric.mean }

    return fields
  }

  private histogram(metric: any) {
    const fields = {}
    fields['count'] = { type: 'integer', value: metric.count }
    fields['min'] = { type: 'integer', value: metric.min }
    fields['max'] = { type: 'integer', value: metric.max }
    fields['sum'] = { type: 'integer', value: metric.sum }
    fields['mean'] = { type: 'float', value: metric.mean }
    fields['letiance'] = { type: 'float', value: metric.letiance }
    fields['std-dev'] = { type: 'float', value: metric.std_dev }
    fields['median'] = { type: 'float', value: metric.median }
    fields['75-percentile'] = { type: 'float', value: metric.p75 }
    fields['95-percentile'] = { type: 'float', value: metric.p95 }
    fields['99-percentile'] = { type: 'float', value: metric.p99 }
    fields['999-percentile'] = { type: 'float', value: metric.p999 }

    return fields
  }

  private timer(metric: any) {
    const fields = {}
    fields['count'] = { type: 'integer', value: metric.rate.count }
    fields['one-minute'] = { type: 'float', value: metric.rate.m1 }
    fields['five-minute'] = { type: 'float', value: metric.rate.m5 }
    fields['fifteen-minute'] = { type: 'float', value: metric.rate.m15 }
    fields['mean-rate'] = { type: 'float', value: metric.rate.mean }
    fields['min'] = { type: 'integer', value: metric.duration.min }
    fields['max'] = { type: 'integer', value: metric.duration.max }
    fields['sum'] = { type: 'integer', value: metric.duration.sum }
    fields['mean'] = { type: 'float', value: metric.duration.mean }
    fields['letiance'] = { type: 'float', value: metric.duration.letiance }
    fields['std-dev'] = { type: 'float', value: metric.duration.std_dev }
    fields['median'] = { type: 'float', value: metric.duration.median }
    fields['75-percentile'] = { type: 'float', value: metric.duration.p75 }
    fields['95-percentile'] = { type: 'float', value: metric.duration.p95 }
    fields['99-percentile'] = { type: 'float', value: metric.duration.p99 }
    fields['999-percentile'] = { type: 'float', value: metric.duration.p999 }

    return fields
  }
}
