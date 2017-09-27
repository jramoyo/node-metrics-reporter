import Report from './Report'

interface Backend {
  write(report: Report): Promise<void>
}

export default Backend
