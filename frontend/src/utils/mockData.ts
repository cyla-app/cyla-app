import { Dispatch } from '@reduxjs/toolkit'
import { addDays, getDate } from 'date-fns'
import { saveMockDays } from '../daysSlice'
import { formatDay } from './date'
import {
  BleedingStrength,
  Day,
  MucusFeeling,
  MucusTexture,
  ExcludeReason,
  CervixOpening,
  CervixFirmness,
} from '../types'

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateMockData = (dispatch: Dispatch) => {
  const randomDate = (start: Date, end: Date) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    )

  const startDate = randomDate(new Date(2020, 0, 1), new Date(2020, 2, 1))
  let day = 0
  const days: Day[] = []
  for (let cycle = 0; cycle < 24; cycle++) {
    const cycleLength = getRandomInt(21, 35)
    const periodLength = getRandomInt(4, 6)
    for (let cycleDay = 0; cycleDay < cycleLength; cycleDay++) {
      const date = addDays(startDate, day)
      day++
      days.push({
        date: formatDay(date),
        bleeding:
          cycleDay === 0
            ? {
                strength: BleedingStrength.STRENGTH_WEAK,
              }
            : cycleDay === periodLength - 2
            ? {
                strength: BleedingStrength.STRENGTH_MEDIUM,
              }
            : cycleDay === periodLength - 1
            ? {
                strength: BleedingStrength.STRENGTH_WEAK,
              }
            : cycleDay < periodLength
            ? {
                strength: BleedingStrength.STRENGTH_STRONG,
              }
            : undefined,
        temperature: {
          value: 37 + Math.sin(Math.sin(0.1 * cycle) * cycle),
          timestamp: date.toISOString(),
          note: '',
          excludeReason: ExcludeReason.EXCLUDE_REASON_NONE,
        },
        mucus: {
          feeling: getRandomInt(
            MucusFeeling.FEELING_NONE,
            MucusFeeling.FEELING_SLIPPERY,
          ),
          texture: getRandomInt(
            MucusTexture.TEXTURE_NONE,
            MucusTexture.TEXTURE_EGG_WHITE,
          ),
        },
        cervix: {
          position: getRandomInt(
            CervixOpening.OPENING_NONE,
            CervixOpening.OPENING_RAISED,
          ),
          firmness: getRandomInt(
            CervixFirmness.FIRMNESS_NONE,
            CervixFirmness.FIRMNESS_SOFT,
          ),
          opening: getRandomInt(
            CervixOpening.OPENING_NONE,
            CervixOpening.OPENING_RAISED,
          ),
        },
      })
    }
  }
  dispatch(saveMockDays(days))
}
