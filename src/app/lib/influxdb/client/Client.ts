interface Client {
  send(buf: Buffer, offset: number, length: number): Promise<void>
  writePoints(batches: string[][]): Promise<void>
}

export default Client
