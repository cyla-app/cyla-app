import { Dispatch } from '@reduxjs/toolkit'
import { addDays, sub } from 'date-fns'
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

  const cycleCount = 14
  const startDate = randomDate(
    sub(new Date(), { days: cycleCount * 29 }),
    sub(new Date(), { days: cycleCount * 26 }),
  )
  let day = 0
  const days: Day[] = []
  for (let cycle = 0; cycle < cycleCount; cycle++) {
    const cycleLength = getRandomInt(26, 29)
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
          value: 36.75 + 0.7 * Math.sin(Math.sin(0.1 * day) * day),
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
