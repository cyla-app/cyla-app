import { markPeriod } from '../periods'
import { Period, BleedingStrength } from '../../types'
import { Day } from '../../types'

describe('periods', () => {
  const bleeingDay = (date: string): Day => ({
    date,
    bleeding: {
      strength: BleedingStrength.STRENGTH_STRONG,
    },
  })

  const noBleeingDay = (date: string): Day => ({
    date,
  })

  it('should add a day afterwards to period if touching', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    expect(periods).toEqual([
      {
        from: '2021-01-29',
        to: '2021-01-30',
      },
    ])
  })

  it('should add a day previous to period if touching', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-30'))
    periods = markPeriod(periods, bleeingDay('2021-01-29'))

    expect(periods).toEqual([
      {
        from: '2021-01-29',
        to: '2021-01-30',
      },
    ])
  })

  it('should create new periods before the other one', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    periods = markPeriod(periods, bleeingDay('2021-01-15'))
    periods = markPeriod(periods, bleeingDay('2021-01-16'))

    expect(periods).toEqual([
      {
        from: '2021-01-15',
        to: '2021-01-16',
      },
      {
        from: '2021-01-29',
        to: '2021-01-30',
      },
    ])
  })

  it('should create new periods after other one', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-15'))
    periods = markPeriod(periods, bleeingDay('2021-01-16'))

    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    expect(periods).toEqual([
      {
        from: '2021-01-15',
        to: '2021-01-16',
      },
      {
        from: '2021-01-29',
        to: '2021-01-30',
      },
    ])
  })

  it('should merge if two periods reach each other', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    periods = markPeriod(periods, bleeingDay('2021-01-27'))
    expect(periods).toEqual([
      {
        from: '2021-01-27',
        to: '2021-01-27',
      },
      {
        from: '2021-01-29',
        to: '2021-01-30',
      },
    ])

    periods = markPeriod(periods, bleeingDay('2021-01-28'))

    expect(periods).toEqual([
      {
        from: '2021-01-27',
        to: '2021-01-30',
      },
    ])

    periods = markPeriod(periods, bleeingDay('2021-01-31'))

    expect(periods).toEqual([
      {
        from: '2021-01-27',
        to: '2021-01-31',
      },
    ])
  })

  it('should narrow period if first day is unmarked', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-28'))
    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    periods = markPeriod(periods, noBleeingDay('2021-01-28'))
    expect(periods).toEqual([
      {
        from: '2021-01-29',
        to: '2021-01-30',
      },
    ])
  })

  it('should narrow period if last day is unmarked', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-28'))
    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    periods = markPeriod(periods, noBleeingDay('2021-01-30'))
    expect(periods).toEqual([
      {
        from: '2021-01-28',
        to: '2021-01-29',
      },
    ])
  })

  it('should split if day in the middle is unmarked', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-28'))
    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    periods = markPeriod(periods, noBleeingDay('2021-01-29'))
    expect(periods).toEqual([
      {
        from: '2021-01-28',
        to: '2021-01-28',
      },
      {
        from: '2021-01-30',
        to: '2021-01-30',
      },
    ])
  })

  it('should should not unmark if in close proximity', () => {
    let periods: Period[] = []

    periods = markPeriod(periods, bleeingDay('2021-01-28'))
    periods = markPeriod(periods, bleeingDay('2021-01-29'))
    periods = markPeriod(periods, bleeingDay('2021-01-30'))

    periods = markPeriod(periods, noBleeingDay('2021-01-31'))
    expect(periods).toEqual([
      {
        from: '2021-01-28',
        to: '2021-01-30',
      },
    ])
  })
})
