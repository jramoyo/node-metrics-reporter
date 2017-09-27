# metrics-reporter

### Usage

```js
import * as metricsReporter from 'metrics-reporter'
const metrics = metricsReporter.createMetrics({ namespace: 'my.namespace', influxdb: { database: 'app_metrics' } })

/**
 * All functions return a Promise to indicate success or failure
 */
Promise.all([

    /**
     * counter(name: string, val = 1, tags = {}, report = true, buffer = false): Promise<void>
     *
     * @param name   - the name of the counter
     * @param val    - the increment/decrement value (defaults to 1)
     * @param tags   - the tags associated with this metric (optional)
     * @param report - report now or delay until next schedule (defaults to true)
     * @param buffer - report to a buffer if available (defaults to false)
     */
    metrics.counter('counter'),

    /**
     * gauge(name: string, val: number, tags = {}, report = true, buffer = false): Promise<void>
     *
     * @param name   - the name of the gauge
     * @param val    - the gauge value
     * @param tags   - the tags associated with this metric (optional)
     * @param report - report now or delay until next schedule (defaults to true)
     * @param buffer - report to a buffer if available (defaults to false)
     */
    metrics.gauge('gauge', 1),

    /**
     * histogram(name: string, val: number, tags = {}, report = true, buffer = false): Promise<void>
     *
     * @param name   - the name of the histogram
     * @param val    - the histogram value
     * @param tags   - the tags associated with this metric (optional)
     * @param report - report now or delay until next schedule (defaults to true)
     * @param buffer - report to a buffer if available (defaults to false)
     */
    metrics.histogram('histogram', 1),

    /**
     * meter(name: string, val = 1, tags = {}, report = true, buffer = false): Promise<void>
     *
     * @param name   - the name of the meter
     * @param val    - the number of occurrence (defaults to 1)
     * @param tags   - the tags associated with this metric (optional)
     * @param report - report now or delay until next schedule (defaults to true)
     * @param buffer - report to a buffer if available (defaults to false)
     */
    metrics.meter('meter'),

    /**
     * timer(name: string, val: number, tags = {}, report = true, buffer = false): Promise<void>
     *
     * @param name   - the name of the timer
     * @param val    - the timer
     * @param tags   - the tags associated with this metric (optional)
     * @param report - report now or delay until next schedule (defaults to true)
     * @param buffer - report to a buffer if available (defaults to false)
     */
    metrics.timer('timer', 1)
]).then((results) => {
    console.log(`Reported ${results.length} metrics to InfluxDB.`)
})
```
