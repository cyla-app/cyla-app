import { Period } from '../period-stats_pb'

describe('protobuf', () => {
  it('should a', () => {
    const period = new Period()
    period.setFrom('from')
    period.setTo('d')

    let buff = Buffer.from(period.serializeBinary())
    let base64data = buff.toString('base64')
    console.log(base64data)
  })
})
