import { PeriodStats } from '../period-stats'

describe('protobuf', () => {
  it('should a', () => {
    const periodStats = { periods: [{ from: 'a', to: 'b' }] }

    let buff = Buffer.from(PeriodStats.encode(periodStats).finish())
    let base64data = buff.toString('base64')
    console.log(base64data)
  })
})
