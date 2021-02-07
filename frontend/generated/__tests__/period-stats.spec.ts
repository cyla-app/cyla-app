import { PeriodStats } from '../period-stats'
import minimal from 'protobufjs/minimal'
import { Day } from '../../src/types'
import { Bleeding_Strength } from '../day'

describe('protobuf', () => {
  it('should a', () => {
    const periodStats = { periods: [{ from: 'a', to: 'b' }] }

    let buff = Buffer.from(PeriodStats.encode(periodStats).finish())
    let base64data = buff.toString('base64')
    console.log(base64data)

    const dayBuffer = Day.encode({
      date: 'asdf',
      bleeding: { strength: Bleeding_Strength.STRENGTH_STRONG },
    }).finish()
    const base64 = minimal.util.base64.encode(dayBuffer, 0, dayBuffer.length)
    console.log(base64)
    buff = Buffer.from(dayBuffer)
    base64data = buff.toString('base64')
    console.log(base64data)

    const outBuffer = new Uint8Array(minimal.util.base64.length(base64))
    const decoded = minimal.util.base64.decode(base64, outBuffer, 0)
    console.log(Day.decode(outBuffer))
  })
})
