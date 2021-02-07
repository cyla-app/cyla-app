import { Bleeding_Strength, Day as Day_ } from '../generated/day'
import { eachDayOfInterval, isSameDay } from 'date-fns'
import { parseDay } from './utils/date'

import { PeriodStats as PeriodStats_ } from '../generated/period-stats'

export {
  Bleeding,
  Mucus,
  Cervix,
  Temperature,
  Temperature_ExcludeReason as ExcludeReason,
  Mucus_Texture as MucusTexture,
  Mucus_Feeling as MucusFeeling,
  Bleeding_Strength as BleedingStrength,
  Cervix_Opening as CervixOpening,
  Cervix_Firmness as CervixFirmness,
  Cervix_Position as CervixPosition,
} from '../generated/day'

export { Period } from '../generated/period-stats'

export const Day = {
  ...Day_,
  isBleeding(day: Day_) {
    return (
      day.bleeding && day.bleeding.strength !== Bleeding_Strength.STRENGTH_NONE
    )
  },
}

export type Day = Day_

export enum DayPosition {
  START = 0,
  BETWEEN = 1,
  END = 2,
}

export const PeriodStats = {
  ...PeriodStats_,
  mapToDates(
    periodStats: PeriodStats_,
  ): { date: Date; position: DayPosition }[] {
    return periodStats.periods
      .map((period) => {
        const from = parseDay(period.from)
        const to = parseDay(period.to)
        return (isSameDay(from, to)
          ? [from]
          : eachDayOfInterval({
              start: from,
              end: to,
            })
        ).map((date) => {
          return {
            date,
            position: isSameDay(date, from)
              ? DayPosition.START
              : isSameDay(date, to)
              ? DayPosition.END
              : DayPosition.BETWEEN,
          }
        })
      })
      .flat(1)
  },
}

export type PeriodStats = PeriodStats_
